import React, { useEffect, useContext, useRef } from "react";
import dynamic from "next/dynamic";

// const Graphin = dynamic(() => import("@antv/graphin"), {
//   ssr: false,
// });
// const Behaviors = dynamic(() => import("@antv/graphin"), {
//   ssr: false,
// });
// const IG6GraphEvent = dynamic(() => import("@antv/graphin"), {
//   ssr: false,
// });
// const GraphinContext = dynamic(() => import("@antv/graphin"), {
//   ssr: false,
// });

import Graphin, {
  Behaviors,
  IG6GraphEvent,
  GraphinContext,
} from "@antv/graphin";
import { INode, NodeConfig, Graph } from "@antv/g6";
import axios from "axios";

interface TreeNode {
  id: string;
  title: string;
  link: string;
  description: string;
  children: TreeNode[];
  style: any;
}

export type SampleBehaviourProps = {
  setTreeNode: (treenode: TreeNode, id: string) => void;
};

const SampleBehaviour: React.FC<SampleBehaviourProps> = ({ setTreeNode }) => {
  const { graph, apis } = useContext(GraphinContext);
  console.log("graph", graph);

  console.log("this is samplebehaviour");
  const url = "https://knowledge-graph-backend.vercel.app/";
  const isMounted = useRef(false);

  const uniqueId = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  };

  useEffect(() => {
    const handleClick = (evt: IG6GraphEvent) => {
      console.log("node clicked");
      const node = evt.item as INode;

      console.log(node);
      // node.style = {
      //   ...node.style,
      //   halo: {
      //     animate: {
      //       attrs: (ratio: number) => {
      //         const startR = 20;
      //         const diff = 26 - startR;
      //         return {
      //           r: startR + diff * ratio,
      //           opacity: 0.5 + 0.5 * ratio,
      //         };
      //       },
      //       duration: 200,
      //       easing: "easeCubic",
      //       delay: 0,
      //       repeat: true,
      //     },
      //     fillOpacity: 0.1,
      //     visible: false,
      //     size: 20,
      //   },
      // };

      const model = node.getModel() as unknown as TreeNode;
      console.log(model.style);

      if (model.children!.length == 0) {
        axios
          .post(url, String(model.title!).concat("!!!", model.description!), {
            headers: {
              "Content-Type": "text/plain",
              // Add any other headers as needed
            },
          })
          .then((response) => {
            console.log("Success:", response.data);
            const clone = structuredClone(model);
            model.title = "poop";
            const dummy = model.style;
            // model.style = {
            //   ...model.style,
            //   halo: {
            //     animate: {
            //       attrs: (ratio: number) => {
            //         const startR = 20;
            //         const maxR = 30;
            //         const diff = maxR - startR;

            //         const adjustedRatio = 1 - Math.abs(1 - 2 * ratio);

            //         return {
            //           r: startR + diff * adjustedRatio, // Use adjustedRatio here
            //           opacity: 0.5 + 0.5 * adjustedRatio, // Adjust opacity similarly if desired
            //         };
            //       },
            //       duration: 400,
            //       easing: "easeCubic",
            //       delay: 0,
            //       repeat: true,
            //     },
            //     // fillOpacity: 0.1,
            //     // visible: true,
            //   },
            // };
            for (var key in response.data) {
              const nodeID: any = uniqueId();
              // graph.addItem("node", {
              //   id: nodeID,
              //   title: key,
              //   link: response.data[key][1],
              //   description: response.data[key][0],
              //   children: [],
              //   style: {
              //     label: {
              //       value: key, // add label
              //     },
              //     halo: {
              //       animate: {
              //         attrs: (ratio: number) => {
              //           // const startR = 20;
              //           // const diff = 30 - startR;
              //           // return {
              //           //   r: startR + diff * ratio,
              //           //   opacity: 0.5 + 0.5 * ratio,
              //           // };
              //           const startR = 20;
              //           const maxR = 30;
              //           const diff = maxR - startR;
              //           // Adjust ratio to oscillate between 0 and 1 twice as fast
              //           // This makes it reach 1 (peak) at the midpoint of the animation, then decrease back to 0
              //           const adjustedRatio = 1 - Math.abs(1 - 2 * ratio);
              //           return {
              //             r: startR + diff * adjustedRatio, // Use adjustedRatio here
              //             opacity: 0.5 + 0.5 * adjustedRatio, // Adjust opacity similarly if desired
              //           };
              //         },
              //         duration: 400,
              //         easing: "easeCubic",
              //         delay: 0,
              //         repeat: true,
              //       },
              //       // fillOpacity: 0.1,
              //       // visible: true,
              //     },
              //   },

              //   // //model.collapsed = false;
              // });

              const newEdgeId = `edge-${graph.getEdges().length + 1}`;
              graph.addItem("edge", {
                id: newEdgeId,
                source: model.id,
                target: nodeID,
                // You can add more edge properties here
              });

              clone.children!.push({
                id: nodeID,
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
              console.log("ran everything");
            }

            // console.log("updated model", clone);
            model.style = dummy;
            setTreeNode(clone, clone.id);
            console.log("do i never see this");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        console.log("nah");
      }
    };
    // graph.save();

    // graph.layout();
    // //graph.paint();
    // graph.refresh();

    if (isMounted.current) {
      //console.log("sample behaviour rendered");
      graph.on("node:click", handleClick);
      //console.log("after click on");
      return () => {
        graph.off("node:click", handleClick);
      };
    } else {
      //console.log("sample behaviour mount");

      isMounted.current = true;
      graph.on("node:click", handleClick);
      //console.log("after click on");
      return () => {
        graph.off("node:click", handleClick);
      };
    }
  });

  return null;
};

export default SampleBehaviour;
