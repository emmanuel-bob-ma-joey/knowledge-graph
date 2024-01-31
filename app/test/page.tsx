"use client";
import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import React, { forwardRef } from "react";
import { Button, Textarea } from "@nextui-org/react";

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

const Test: React.FC = forwardRef((props, ref) => {
  return (
    <section className="items-center justify-center">
      <p>{defaultstring}</p>
    </section>
  );
});

export default Test;
