variable "project_name" {
  description = "The name of the project."
  type        = string
}

variable "environment" {
  description = "The deployment environment (e.g., dev, staging, prod)."
  type        = string
}

variable "tags" {
  description = "A map of tags to assign to the resources."
  type        = map(string)
  default     = {}
}

variable "kms_key_id" {
  description = "The ID of the KMS key to use for SNS/SQS encryption."
  type        = string
}

variable "sns_topics" {
  description = "A map of SNS topics to create. Key is the logical name."
  type = map(object({
    fifo_topic = bool
  }))
  default = {}
}

variable "sqs_queues" {
  description = "A map of SQS queues to create. Key is the logical name."
  type = map(object({
    fifo_queue                   = bool
    visibility_timeout_seconds   = number
    message_retention_seconds    = number
    create_dlq                   = bool
    dlq_max_receive_count        = number
    subscribed_topic_names       = list(string)
    allow_publish_from_sns_topics = list(string)
  }))
  default = {}
}