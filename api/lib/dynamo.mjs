import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

let client;

function getClient() {
  if (!client) {
    const base = new DynamoDBClient({});
    client = DynamoDBDocumentClient.from(base, {
      marshallOptions: { removeUndefinedValues: true },
    });
  }
  return client;
}

export function tableName() {
  const name = process.env.DYNAMODB_TABLE_NAME;
  if (!name) throw new Error("DYNAMODB_TABLE_NAME is not set");
  return name;
}

export async function putItem(item) {
  await getClient().send(
    new PutCommand({
      TableName: tableName(),
      Item: item,
      ConditionExpression: "attribute_not_exists(id)",
    })
  );
}

export async function getItem(id) {
  const res = await getClient().send(
    new GetCommand({
      TableName: tableName(),
      Key: { id },
    })
  );
  return res.Item ?? null;
}

export async function scanItems(limit = 100) {
  const res = await getClient().send(
    new ScanCommand({
      TableName: tableName(),
      Limit: limit,
    })
  );
  return res.Items ?? [];
}

export async function scanItemsByKind(kind, limit = 500) {
  const items = [];
  let lastKey;

  do {
    const res = await getClient().send(
      new ScanCommand({
        TableName: tableName(),
        FilterExpression: "#kind = :kind",
        ExpressionAttributeNames: { "#kind": "kind" },
        ExpressionAttributeValues: { ":kind": kind },
        ExclusiveStartKey: lastKey,
        Limit: limit,
      })
    );
    items.push(...(res.Items ?? []));
    lastKey = res.LastEvaluatedKey;
  } while (lastKey && items.length < limit);

  return items;
}

export async function upsertItem(item) {
  await getClient().send(
    new PutCommand({
      TableName: tableName(),
      Item: item,
    })
  );
}

export async function deleteItem(id) {
  await getClient().send(
    new DeleteCommand({
      TableName: tableName(),
      Key: { id },
    })
  );
}
