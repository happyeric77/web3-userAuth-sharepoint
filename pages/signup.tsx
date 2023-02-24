import { useWeb3 } from "evm-web3-hooks";
import { ChangeEvent, FC, useState } from "react";

interface IUserInfo {
  walletAddress: string;
  basicInfoSignature: string;
  stringifiedBasicInfo: string;
  profileImage: string;
}
interface IBasicInfo {
  userName: string;
  email: string;
}

const SignUp: FC = () => {
  const { web3Data } = useWeb3();
  const [basicInfo, setBasicInfo] = useState<IBasicInfo>({} as IBasicInfo);
  const [profileImage, setProfileImage] = useState<string>("");

  const signUp = async () => {
    const stringifiedBasicInfo = JSON.stringify(basicInfo);

    const signature = await web3Data.web3.eth.personal.sign(stringifiedBasicInfo, web3Data.accounts[0], "");
    console.log({ signature });

    const userInfo: IUserInfo = {
      walletAddress: web3Data.accounts[0],
      basicInfoSignature: signature,
      stringifiedBasicInfo,
      profileImage,
    };

    // TODO
    // Store Data into database

    const signer = await web3Data.web3.eth.personal.ecRecover(stringifiedBasicInfo, signature);
    console.log({ signer });
  };

  function uploadImage(event: ChangeEvent<HTMLInputElement>): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfileImage(base64String);
    };
    reader.readAsDataURL(file);
  }
  return (
    <>
      <input type="file" onChange={uploadImage} />
      <div>Input UserName</div>
      <input type="text" onChange={(evt) => setBasicInfo((old) => ({ ...old, userName: evt.target.value }))} />
      <div>Input Email</div>
      <input type="text" onChange={(evt) => setBasicInfo((old) => ({ ...old, email: evt.target.value }))} />
      <div onClick={signUp}>Sign up</div>
    </>
  );
};

export default SignUp;
