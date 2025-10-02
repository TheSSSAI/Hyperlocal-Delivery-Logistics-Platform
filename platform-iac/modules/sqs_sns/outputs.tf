output "sns_topic_arns" {
  description = "A map of SNS topic names to their ARNs."
  value       = { for k, v in aws_sns_topic.topics : k => v.arn }
}

output "sqs_queue_urls" {
  description = "A map of SQS queue names to their URLs."
  value       = { for k, v in aws_sqs_queue.main_queues : k => v.id }
}

output "sqs_queue_arns" {
  description = "A map of SQS queue names to their ARNs."
  value       = { for k, v in aws_sqs_queue.main_queues : k => v.arn }
}

output "dlq_queue_urls" {
  description = "A map of SQS DLQ names to their URLs."
  value       = { for k, v in aws_sqs_queue.dlqs : k => v.id }
}

output "dlq_queue_arns" {
  description = "A map of SQS DLQ names to their ARNs."
  value       = { for k, v in aws_sqs_queue.dlqs : k => v.arn }
}