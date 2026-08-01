# Grant the GitHub Actions deploy role permission to sync bestiary markdown
# into the API DynamoDB table on merge to main.

data "aws_iam_policy_document" "bestiary_sync" {
  statement {
    sid    = "BestiaryDynamoSync"
    effect = "Allow"
    actions = [
      "dynamodb:PutItem",
      "dynamodb:GetItem",
      "dynamodb:Scan",
      "dynamodb:DeleteItem",
    ]
    resources = [
      "arn:aws:dynamodb:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:table/${module.site.dynamodb_table_name}",
      "arn:aws:dynamodb:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:table/${module.site.dynamodb_table_name}/index/*",
    ]
  }
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

resource "aws_iam_policy" "bestiary_sync" {
  name   = "kaiju-bestiary-gha-bestiary-sync"
  policy = data.aws_iam_policy_document.bestiary_sync.json
}

resource "aws_iam_role_policy_attachment" "bestiary_sync" {
  role       = module.site.role_name
  policy_arn = aws_iam_policy.bestiary_sync.arn
}
