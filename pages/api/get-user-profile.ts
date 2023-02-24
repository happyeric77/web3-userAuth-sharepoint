import { getAccessToken, GraphApiQuery } from "ms365-graph-api-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { IUserInfo } from "../signup";

type ResponseData = {
  error?: string;
  userData?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "GET") {
    return res.status(405).send({ error: "Only GET" });
  }
  const userAddress = req.query.walletAddress;
  const authResponse = await getAccessToken(process.env.CLIENT_ID!, process.env.CLIENT_SECRET!, process.env.TENANT_ID!);

  if (!authResponse) return;
  const query = new GraphApiQuery(authResponse.accessToken);
  const mySite = await query.getSites("GraphApi");
  const myList = await query.getListsInSite(mySite.value[0].id, "UserInfo");

  const items = await query.getItemsInList(mySite.value[0].id, myList.value[0].id);
  const itemInfos = items.value.map((item) => item.fields).filter((item) => item) as IUserInfo[];

  const existingUser = itemInfos.find((info) => info.Title === userAddress);

  if (!existingUser) {
    return res.status(200).send({ userData: {} });
  } else {
    res.status(200).send({ userData: existingUser });
  }
}
