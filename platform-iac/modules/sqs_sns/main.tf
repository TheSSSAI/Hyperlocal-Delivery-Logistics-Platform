locals {
  tags = merge(
    var.tags,
    {
      "Project"     = var.project_name
      "Environment" = var.environment
      "Module"      = "SQS-SNS"
    }
  )
}

# --- SNS Topics ---
resource "aws_sns_topic" "topics" {
  for_each = var.sns_topics

  name              = "${var.project_name}-${var.environment}-${each.key}"
  kms_master_key_id = var.kms_key_id
  fifo_topic        = each.value.fifo_topic
  content_based_deduplication = each.value.fifo_topic ? true : false

  tags = local.tags
}

# --- SQS Queues ---
resource "aws_sqs_queue" "dlqs" {
  for_each = { for k, v in var.sqs_queues : k => v if v.create_dlq }

  name                        = "${var.project_name}-${var.environment}-${each.key}-dlq"
  kms_master_key_id           = var.kms_key_id
  kms_data_key_reuse_period_seconds = 300
  fifo_queue                  = each.value.fifo_queue
  content_based_deduplication = each.value.fifo_queue ? true : false
  message_retention_seconds   = 1209600 # 14 days for DLQs

  tags = local.tags
}

resource "aws_sqs_queue" "main_queues" {
  for_each = var.sqs_queues

  name                        = "${var.project_name}-${var.environment}-${each.key}"
  kms_master_key_id           = var.kms_key_id
  kms_data_key_reuse_period_seconds = 300
  fifo_queue                  = each.value.fifo_queue
  content_based_deduplication = each.value.fifo_queue ? true : false
  visibility_timeout_seconds  = each.value.visibility_timeout_seconds
  message_retention_seconds   = each.value.message_retention_seconds

  redrive_policy = jsonencode(
    each.value.create_dlq ? {
      deadLetterTargetArn = aws_sqs_queue.dlqs[each.key].arn
      maxReceiveCount     = each.value.dlq_max_receive_count
    } : null
  )

  tags = local.tags
}

# --- SNS Topic Subscriptions ---
resource "aws_sns_topic_subscription" "subscriptions" {
  # Create a unique key for each queue-topic pair
  for_each = {
    for queue_key, queue_config in var.sqs_queues :
    for topic_name in queue_config.subscribed_topic_names :
    "${queue_key}-${topic_name}" => {
      queue_key  = queue_key
      topic_name = topic_name
    }
  }

  topic_arn = aws_sns_topic.topics[each.value.topic_name].arn
  protocol  = "sqs"
  endpoint  = aws_sqs_queue.main_queues[each.value.queue_key].arn

  # Optional: for filtering messages
  # filter_policy = jsonencode({})
}

# --- SQS Queue Policies ---
data "aws_iam_policy_document" "sqs_policy_docs" {
  for_each = {
    for k, v in var.sqs_queues : k => v
    if length(v.allow_publish_from_sns_topics) > 0
  }

  statement {
    sid    = "AllowSNSPublish"
    effect = "Allow"
    principals {
      type        = "Service"
      identifiers = ["sns.amazonaws.com"]
    }
    actions = ["sqs:SendMessage"]
    resources = [
      aws_sqs_queue.main_queues[each.key].arn
    ]
    condition {
      test     = "ArnEquals"
      variable = "aws:SourceArn"
      values = [
        for topic_name in each.value.allow_publish_from_sns_topics : aws_sns_topic.topics[topic_name].arn
      ]
    }
  }
}

resource "aws_sqs_queue_policy" "sqs_policies" {
  for_each = data.aws_iam_policy_document.sqs_policy_docs

  queue_url = aws_sqs_queue.main_queues[each.key].id
  policy    = each.value.json
}