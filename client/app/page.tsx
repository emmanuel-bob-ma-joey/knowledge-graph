"use client";

import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import React, { useEffect, useRef, forwardRef } from "react";
import { Button, Textarea, CircularProgress } from "@nextui-org/react";
import Graphin, { Utils, Behaviors } from "@antv/graphin";
import { Row, Col, Card } from "antd";
import axios from "axios";
import CompactBox from "../components/compactbox";

var pos = require("pos");

// interface TreeNode {
//   id: string;
//   title: string;
//   link: string;
//   description: string;
//   children: TreeNode[];
//   style: any;
// }
// const rootNode: TreeNode = {
//   id: "1",
//   title: "root",
//   link: "",
//   description: "",
//   children: [],
//   style: {
//     label: "root",
//   },
// };
const defaultstring =
  "A transformer is a deep learning architecture based on the multi-head attention mechanism. It is notable for not containing any recurrent units, and thus requires less training time than previous recurrent neural architectures, such as long short-term memory.";

const Home: React.FC = forwardRef((props, ref) => {
  const [value, setValue] = React.useState(defaultstring);
  const [submit, setSubmit] = React.useState(false);
  const handleSubmit = () => {
    setSubmit(true);
  };

  function valueChanged(str: string): void {
    str ? setValue(str) : setValue(defaultstring);
  }

  return (
    <section className="items-center justify-center">
      {submit ? (
        <section className="flex flex-col items-center justify-center ">
          <CompactBox
            treeData={{
              id: "1",
              title: "root",
              link: "",
              description: value,
              children: [],
              style: {
                label: "root",
              },
            }}
          />
        </section>
      ) : (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className="inline-block max-w-lg text-center justify-center">
            <h1 className={title()}>Learn by building&nbsp;</h1>
            <br />
            <h1 className={title({ color: "violet" })}>
              knowledge graphs&nbsp;
            </h1>

            {/* <h1 className={title()}>Knowledge Graphs.</h1> */}
            <h2 className={subtitle({ class: "mt-4" })}>
              Enter text to get started
            </h2>
          </div>

          <div className="flex gap-3">
            <Link
              isExternal
              className={buttonStyles({ variant: "bordered", radius: "full" })}
              href={siteConfig.links.github}
            >
              <GithubIcon size={20} />
              GitHub
            </Link>
          </div>
          {/* <h2 className={subtitle({ class: "mt-4" })}>
        "A transformer is a deep learning architecture based on the multi-head
        attention mechanism. // It is notable for not containing any recurrent
        units, and thus requires less training time than previous recurrent
        neural architectures, // such as long short-term memory."
      </h2> */}
          <div className="mt-8  min-w-lg">
            {/* <Textarea
              // isInvalid={false}
              variant="bordered"
              // placeholder="Enter your text"
              placeholder="A transformer is a deep learning architecture based on the multi-head attention mechanism.
              It is notable for not containing any recurrent units, and thus requires less training time than previous recurrent neural architectures,
              such as long short-term memory."
              value={value}
              onValueChange={setValue}
              // errorMessage="The description should be at least 255 characters long."
              className="max-w-xs"
            /> */}

            <Textarea
              label="Description"
              labelPlacement="outside"
              placeholder="A transformer is a deep learning architecture based on the multi-head attention mechanism.
              It is notable for not containing any recurrent units, and thus requires less training time than previous recurrent neural architectures,
              such as long short-term memory."
              onValueChange={valueChanged}
              minRows={4}
              // className="w-auto"
              classNames={{
                base: "w-96",
                // input: "resize-y min-h-[40px]",
              }}
            />
            <Button
              radius="full"
              className="bg-gradient-to-tr from-pink-500 to-orange-500 text-white shadow-lg"
              onPress={handleSubmit}
            >
              Generate graph
            </Button>
          </div>
        </section>
      )}
    </section>
  );
});

export default Home;
