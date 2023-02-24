import { getAccessToken, GraphApiQuery } from "ms365-graph-api-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { IUserInfo } from "../signup";
import Web3 from "web3";

type ResponseData = {
  error?: string;
  userData?: any;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== "POST" && req.body) {
    return res.status(405).send({ error: "Only POST" });
  }
  const newUserInfo = req.body as IUserInfo;
  const authResponse = await getAccessToken(process.env.CLIENT_ID!, process.env.CLIENT_SECRET!, process.env.TENANT_ID!);

  if (!authResponse) return;

  // TODO Authenticate if the signer is the actual sender
  const web3 = new Web3();
  const signer = await web3.eth.accounts.recover(newUserInfo.stringifiedBasicInfo, newUserInfo.basicInfoSignature);

  if (signer !== newUserInfo.walletAddress) {
    return res.status(401).send({ error: "Make sure signer is sender" });
  }

  const query = new GraphApiQuery(authResponse.accessToken);
  const mySite = await query.getSites("GraphApi");
  const myList = await query.getListsInSite(mySite.value[0].id, "UserInfo");

  const items = await query.getItemsInList(mySite.value[0].id, myList.value[0].id);
  const itemInfos = items.value.map((item) => item.fields).filter((item) => item) as IUserInfo[];

  const existingUser = itemInfos.find((info) => info.Title === newUserInfo.Title);

  if (!existingUser) {
    const createdItem = await query.postCreateListItem(
      mySite.value[0].id,
      myList.value[0].id,
      newUserInfo as unknown as { [key: string]: string }
    );
    return res.status(200).send({ userData: createdItem });
  }

  const updatedItem = await query.patchUpdateListItem(
    mySite.value[0].id,
    myList.value[0].id,
    //@ts-ignore
    existingUser.id, // default id field for 365
    newUserInfo as unknown as { [key: string]: string }
  );
  res.status(200).send({ userData: updatedItem });
}
