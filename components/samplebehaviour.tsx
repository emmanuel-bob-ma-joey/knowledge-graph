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
  title: string;
  link: string;
  description: string;
  children: TreeNode[];
  style: any;
}

interface SampleBehaviourProps {
  setTreeNode: (treenode: TreeNode, id: string) => void;
}

const uniqueId = () => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substr(2);
  return dateString + randomness;
};

const SampleBehaviour: React.FC<SampleBehaviourProps> = ({ setTreeNode }) => {
  const { graph, apis } = useContext(GraphinContext);
  console.log("graph", graph);
  const url = "https://knowledge-graph-backend.vercel.app/";
  const isMounted = useRef(false);
  useEffect(() => {
    //console.log("samplebehaviour has been rendered");
    const handleHover = (evt: IG6GraphEvent) => {
      console.log("node hovered");
      const node = evt.item as INode;
      const model = node.getModel() as NodeConfig;
      //apis.focusNodeById(model.id);
    };

    const handleChange = (e: IG6GraphEvent) => {
      const { item, collapsed } = e;
      const model = item!.get("model");
      model.collapsed = collapsed;
    };

    const handleClick = async (evt: IG6GraphEvent) => {
      const node = evt.item as INode;
      const model = node.getModel() as unknown as TreeNode;
      if (model.children!.length == 0) {
        axios
          .post(url, String(model.title!).concat("!!!", model.description!), {
            headers: {
              "Content-Type": "application/json",

              // Add any other headers as needed
            },
          })
          .then((response) => {
            console.log("Success:", response.data);
            const clone = structuredClone(model);
            for (var key in response.data) {
              clone.children!.push({
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
              //model.collapsed = false;
            }
            console.log("updated model", clone);
            setTreeNode(clone, clone.id);
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

    if (isMounted.current) {
      console.log("sample behaviour rendered");
      graph.on("node:click", handleClick);

      return () => {
        graph.off("node:click", handleClick);
      };
    } else {
      console.log("sample behaviour mount");
      isMounted.current = true;
      // graph.on("node:click", handleClick);
    }
  });

  return null;
};

export default SampleBehaviour;
