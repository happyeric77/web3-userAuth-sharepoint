import { Button, Input, Space } from "antd";
import axios from "axios";
import { useWeb3 } from "evm-web3-hooks";
import Link from "next/link";
import { FC, useState } from "react";

export interface IUserInfo {
  Title: string; // Default field for 365
  walletAddress: string;
  basicInfoSignature: string;
  stringifiedBasicInfo: string;
}
interface IBasicInfo {
  userName: string;
  email: string;
}

const SignUp: FC = () => {
  const { web3Data } = useWeb3();
  const [basicInfo, setBasicInfo] = useState<IBasicInfo>({} as IBasicInfo);

  const signUp = async () => {
    const stringifiedBasicInfo = JSON.stringify(basicInfo);

    const signature = await web3Data.web3.eth.personal.sign(stringifiedBasicInfo, web3Data.accounts[0], "");
    console.log({ signature });

    const userInfo: IUserInfo = {
      Title: web3Data.accounts[0],
      walletAddress: web3Data.accounts[0],
      basicInfoSignature: signature,
      stringifiedBasicInfo,
    };

    await axios.post("/api/update-user-profile", userInfo);
  };

  return (
    <>
      <Input
        addonBefore="Input UserName"
        type="text"
        onChange={(evt) => setBasicInfo((old) => ({ ...old, userName: evt.target.value }))}
      />
      <Input
        addonBefore="Input Email"
        type="text"
        onChange={(evt) => setBasicInfo((old) => ({ ...old, email: evt.target.value }))}
      />
      <div>
        <Button onClick={signUp}>SIGN UP / UPDATE</Button>
      </div>
      Back to <Link href={"/"}>HOME</Link>
    </>
  );
};

export default SignUp;
