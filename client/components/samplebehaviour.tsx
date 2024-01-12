import React, { useEffect, useContext, useRef } from "react";

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
  setTreeNode: (treenode: NodeConfig, id: string) => void;
}

const uniqueId = () => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substr(2);
  return dateString + randomness;
};

const SampleBehaviour: React.FC<SampleBehaviourProps> = ({
  tree,
  setTreeNode,
}) => {
  const { graph, apis } = useContext(GraphinContext);
  const url = "http://127.0.0.1:5000/api/tag";
  const isMounted = useRef(false);
  useEffect(() => {
    console.log("samplebehaviour has been rendered");
    const handleHover = (evt: IG6GraphEvent) => {
      console.log("node hovered");
      const node = evt.item as INode;
      const model = node.getModel() as NodeConfig;
      console.log(model.description);
      //apis.focusNodeById(model.id);
    };

    const handleChange = (e: IG6GraphEvent) => {
      const { item, collapsed } = e;
      const model = item!.get("model");
      console.log("this is the model", model);

      model.collapsed = collapsed;
    };

    const handleClick = async (evt: IG6GraphEvent) => {
      const node = evt.item as INode;
      const model = node.getModel() as NodeConfig;
      if (model.children!.length == 0) {
        axios
          .post(url, model.description, {
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
                id: uniqueId(),
                title: key,
                link: response.data[key][1],
                description: response.data[key][0],
                children: [],
                style: {
                  label: {
                    value: key, // add label
                  },
                },
              });
              model.collapsed = false;
              console.log("children added");
            }
            console.log("updated tree", tree);
            console.log("updated model", model);
            console.log("model is of type", typeof model);
            setTreeNode(model, model.id);
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
        console.log("the tree", tree);
      }
    };

    if (isMounted.current) {
      graph.on("node:click", handleClick);

      return () => {
        graph.off("node:click", handleClick);
      };
    } else {
      console.log("onload");
      isMounted.current = true;
    }
  }, []);

  return null;
};

export default SampleBehaviour;
