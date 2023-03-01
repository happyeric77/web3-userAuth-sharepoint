import { Input } from "antd";
import axios from "axios";
import { useWeb3 } from "evm-web3-hooks";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { IUserInfo } from "./signup";

const Home: FC = () => {
  const { web3Data } = useWeb3();
  const [userInfo, setUSerInfo] = useState<IUserInfo | null>(null);
  useEffect(() => {
    if (!web3Data.accounts?.[0]) return;
    axios
      .get("/api/get-user-profile", {
        params: {
          walletAddress: web3Data.accounts[0],
        },
      })
      .then((userInfo) => {
        if (!userInfo.data.userData.Title) {
          setUSerInfo(() => null);
        } else {
          const userData = userInfo.data.userData as IUserInfo;
          const signer = web3Data.web3.eth.accounts.recover(userData.stringifiedBasicInfo, userData.basicInfoSignature);
          if (signer !== web3Data.accounts[0])
            return alert("Your profile data might have been hacked, please reset and contact admin");
          setUSerInfo(() => userData);
        }
      });
  }, [web3Data.accounts?.[0]]);
  return (
    <>
      {web3Data.accounts?.[0] ? (
        <>
          {userInfo ? (
            <div>
              <Input addonBefore="UserName" value={JSON.parse(userInfo.stringifiedBasicInfo).userName} />
              <Input addonBefore="Email" value={JSON.parse(userInfo.stringifiedBasicInfo).email} />
              Update you profile check <Link href={"/signup"}>HERE</Link>
            </div>
          ) : (
            <div>
              You not signed up yet, sign up <Link href="/signup">HERE</Link>
            </div>
          )}
        </>
      ) : (
        <>Connect Your Wallet first</>
      )}
    </>
  );
};
export default Home;
