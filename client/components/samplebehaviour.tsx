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
  //   addChildrenToTreeNode: (children: TreeNode[], id: string) => void;
}

const SampleBehaviour: React.FC<SampleBehaviourProps> = ({
  tree,
  //   addChildrenToTreeNode,
}) => {
  const { graph, apis } = useContext(GraphinContext);
  const url = "http://127.0.0.1:5000/api/tag";

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
      //   console.log("the clicked node is ", model.id);
      //   console.log("this is model in samplebehaviour", model);
      //   console.log("i am in samplebehaviour and this is the tree data:", tree);
      //   tree.description = "poopy poop";

      //   const newNode = {
      //     id: "poop", // Unique identifier for the new node
      //     description: "poopy",
      //     link: "asda",
      //     children: [],
      //   };

      //   const newEdge = {
      //     source: "root",
      //     target: "poop",
      //   };
      //   graph.addItem("edge", newEdge);
      //   graph.addItem("node", newNode);

      //addChildrenToTreeNode([newNode], "root");
      //   model.children = [newNode];
      //   console.log("children added");

      const query = {
        text: model.description,
      };

      if (model.children!.length == 0) {
        axios
          .post(url, query, {
            headers: {
              "Content-Type": "application/json",

              // Add any other headers as needed
            },
          })
          .then((response) => {
            console.log("Success:", response.data);
            for (var key in response.data) {
              console.log("added node ", key);
              model.children!.push({
                id: key,
                link: response.data[key][1],
                description: response.data[key][0],
                children: [],
                style: {
                  label: {
                    value: key, // add label
                  },
                },
              });
              console.log("children added");
            }
            console.log("updated tree", tree);
            //addChildrenToTreeNode([newNode], "root");
            // walk(tree, (node) => {
            //   node.style = {
            //     label: {
            //       value: node.id, // add label
            //     },
            //   };
            // });
            // setState({
            //   data: tree,
            // });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        console.log("nah");
      }
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
