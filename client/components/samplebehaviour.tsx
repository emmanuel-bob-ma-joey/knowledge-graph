import React, { useEffect, useContext } from "react";

import Graphin, {
  Behaviors,
  IG6GraphEvent,
  GraphinContext,
} from "@antv/graphin";
import { INode, NodeConfig } from "@antv/g6";
import axios from "axios";

interface TreeNode {
  id: string;
  link: string;
  description: string;
  children: TreeNode[];
}

interface SampleBehaviourProps {
  tree: TreeNode;
}

const SampleBehaviour: React.FC<SampleBehaviourProps> = ({ tree }) => {
  const { graph, apis } = useContext(GraphinContext);

  useEffect(() => {
    const handleHover = (evt: IG6GraphEvent) => {
      console.log("node hovered");
      const node = evt.item as INode;
      const model = node.getModel() as NodeConfig;
      console.log(model.description);
      //apis.focusNodeById(model.id);
    };

    const handleClick = (evt: IG6GraphEvent) => {
      console.log("node clicked");
      const node = evt.item as INode;
      const model = node.getModel() as NodeConfig;
      console.log(model.id);
      console.log("i am in samplebehaviour and this is the tree data:", tree);
      tree.description = "poopy poop";

      const newNode = {
        id: "newNodeId", // Unique identifier for the new node
        data: {
          lable: "New Node",
          id: "poop",
        },
        // style: {
        //   keyshape: {
        //     size: 30, // Size of the node
        //   },
        // },
        // shape: "circle", // You can change the shape based on your requirements
        // x: 100, // X-coordinate of the new node
        // y: 100, // Y-coordinate of the new node
      };
      graph.add("node", newNode);
    };
    // Each click focuses on the clicked node
    graph.on("node:mouseover", handleHover);
    graph.on("node:click", handleClick);
    return () => {
      graph.off("node:mouseover", handleHover);
      graph.off("node:click", handleClick);
    };
  }, []);

  return null;
};

export default SampleBehaviour;
