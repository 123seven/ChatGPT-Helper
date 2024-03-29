import { AnimatePresence, motion } from "framer-motion";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import DropDown, { VibeType } from "../components/DropDown";
import Footer from "../components/Footer";
import Github from "../components/GitHub";
import LoadingDots from "../components/LoadingDots";
import ResizablePanel from "../components/ResizablePanel";

const Home: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [desc, setDesc] = useState("");
  const [lang, setLang] = useState<VibeType>("聊天");
  const [generatedDescs, setGeneratedDescs] = useState<string>("");
  const defultDesc = '告诉我更多关于你的信息。'
  console.log("Streamed response: ", { generatedDescs });

  let text = desc || defultDesc

  text = `${text}${text.slice(-1) === "." ? "" : "."}`

  const generateDesc = async (e: any) => {
    e.preventDefault();
    setGeneratedDescs("");
    setLoading(true);
    console.log(lang)
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        replyMode: lang,
        text: text
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }
    console.log(response)
    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setGeneratedDescs((prev) => prev + chunkValue);
    }

    setLoading(false);
  };

  return (
    <div className="flex max-w-5xl mx-auto flex-col items-center justify-center py-2 min-h-screen">
      <Head>
        <title>ChatGPT 小助手</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-2 sm:mt-4">
        <div className="flex justify-between space-x-5">

          <a
            className="flex max-w-fit items-center justify-center space-x-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm text-gray-600 shadow-md transition-colors hover:bg-gray-100 mb-5"
            href="https://github.com/123seven/ChatGPT-Helper"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github />
            <p>Star on GitHub</p>
          </a>
        </div>

        <h1 className="sm:text-3xl text-2xl max-w-1xl font-bold text-slate-900">
          ChatGPT 助手
        </h1>
        <div className="text-slate-500 mt-5">
          ⚠️由于OpenAI免费配额有限，有能力的同学可选择
          <a
            href="https://vercel.com/new/clone?repository-url=https://github.com/123seven/ChatGPT-Helper&env=OPENAI_API_KEY&project-name=chatgpt-helper&repo-name=chatgpthelper"
            target="_blank"
            rel="noreferrer"
            className="font-bold hover:underline transition underline-offset-2 text-slate-900"
          >
            Vercel
          </a>
          一键部署自己的ChatGPT助手
        </div>

        <p className="text-slate-1000 mt-5 sm:text-2xl" >
          此功能于2023-02-19 20:00:00下线<br></br>

          <p className="text-2xl mt-5">
          请访问新网站<a className="text-blue-600"
           href="https://smartchat.unknownbyte.com">
          https://smartchat.unknownbyte.com
          </a>
          </p>
        <br></br>
        </p>
        <p className="text-slate-1000 mt-5 " style={{textAlign: "left"}}>
        1.为什么暂时下线？<br></br>
        ①.由于此网站的使用人数过多，作者无力承担随之而来的运营成本。<br></br>
        ②.产品存在合规风险，个人开发者无力应对审查机制。<br></br>
        <br></br>
        2.我迫切需要这个功能，你有什么办法能让我用上吗？<br></br>
        想办法搞个ChatGPT账号自己问。<br></br>
        <br></br>
        还有什么想说想问的都可以通过邮箱steven.zhu.email@gmail.com联系我
        </p>

        <div className="max-w-xl w-full">
          <div className="flex mt-4 items-center space-x-3 mb-3">
            <Image
              src="/1-black.png"
              width={30}
              height={30}
              alt="1 icon"
            />
            <p className="text-left font-medium">
              输入您想说的话
            </p>
          </div>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black my-2"
            placeholder={
              "例如: " + defultDesc
            }
          />
          <div className="flex mb-5 items-center space-x-3">
            <Image src="/2-black.png" width={30} height={30} alt="1 icon" />
            <p className="text-left font-medium">选择回答模式</p>
          </div>
          <div className="block">
            <DropDown vibe={lang} setVibe={(newLang) => setLang(newLang)} />
          </div>

          {!loading && (
            <button
              disabled
              className="bg-black/80 rounded-xl text-white font-medium px-4 py-2 sm:mt-4 mt-3 w-full"
            >
              生成回答 &rarr;
            </button>
          )}
          {loading && (
            <button
              className="bg-black rounded-xl text-white font-medium px-4 py-2 sm:mt-4 mt-3 hover:bg-black/80 w-full"
              disabled
            >
              <LoadingDots color="white" style="large" />
            </button>
          )}
        </div>
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{ duration: 2000 }}
        />
        <hr className="h-px bg-gray-700 border-1 dark:bg-gray-700" />
        <ResizablePanel>
          <AnimatePresence mode="wait">
            <motion.div className="space-y-10 my-4">
              {generatedDescs && (
                <>
                  <div>
                    <h2 className="sm:text-4xl text-3xl font-bold text-slate-900 mx-auto">
                      回答
                    </h2>
                  </div>
                  <div className="space-y-8 flex flex-col items-center justify-center max-w-xl mx-auto  whitespace-pre-wrap">

                    <div
                      className="bg-white rounded-xl shadow-md p-4 hover:bg-gray-100 transition cursor-copy border text-left"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedDescs);
                        toast("helper copied to clipboard", {
                          icon: "✂️",
                        });
                      }}
                    >
                      <p>{generatedDescs}</p>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
