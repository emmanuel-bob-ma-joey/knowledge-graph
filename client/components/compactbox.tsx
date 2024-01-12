import React, { useEffect, useContext, useRef } from "react";
import { CircularProgress } from "@nextui-org/react";
import type { TooltipValue } from "@antv/graphin";
import Graphin, {
  Behaviors,
  Components,
  IG6GraphEvent,
  GraphinContext,
} from "@antv/graphin";
import { INode, NodeConfig } from "@antv/g6";
import axios from "axios";
import SampleBehaviour from "../components/samplebehaviour";
import CustomTreeCollapse from "./customtreecollapse";
const { ActivateRelations, Hoverable } = Behaviors;
const { Tooltip } = Components;

interface TreeNode {
  id: string;
  title: string;
  link: string;
  description: string;
  children: TreeNode[];
}
// const rootNode: TreeNode = {
//   id: "root",
//   link: "",
//   description: "",
//   children: [],
//   style:
// };
const uniqueId = () => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substr(2);
  return dateString + randomness;
};

const walk = (
  node: { children: any[] },
  callback: { (node: any): void; (arg0: any): void }
) => {
  callback(node);
  if (node.children && node.children.length !== 0) {
    node.children.forEach((n) => {
      walk(n, callback);
    });
  }
};
export type PlacementType = "top" | "bottom" | "right" | "left";

const CompactBox = (props: any) => {
  const url = "http://127.0.0.1:5000/api/tag";
  const [loading, setLoading] = React.useState(false);
  //   const [state, setState] = React.useState({
  //     data: null,
  //   });
  const isMounted = useRef(false);

  const [tree, setTree] = React.useState(props.treeData);

  //const { graph, apis } = React.useContext(GraphinContext);
  //   const graphinContext = useContext(GraphinContext);
  //   const { graph, bindEvents } = graphinContext;
  //   console.log("this is first graph", graph);

  //   const [placement, setPlacement] = React.useState<PlacementType>("top");
  //   const [hasArrow, setArrow] = React.useState<boolean>(true);
  //   const [styleText, setStyleText] = React.useState<string>(`{
  //     "width":"400px",
  //     "opacity":1

  //   }`);
  //   let style = {};
  //   try {
  //     style = JSON.parse(styleText);
  //   } catch (error) {
  //     console.log(error);
  //   }

  const getTreeChildren = (treenode: TreeNode) => {
    return treenode.children;
  };

  const setTreeNode = (treenode: NodeConfig, id: string) => {
    //assumes id is garuant
    console.log("called setTreeNode");
    const clone = structuredClone(tree);
    let queue = [clone];
    var child;
    while (queue.length) {
      child = queue.shift();
      if (child!.id == id) {
        child!.children = treenode.children;
        console.log("added children to node", child!.id);
        console.log("new tree is", clone);
        console.log("old tree is", tree);
        setTree(clone);
        break;
      } else {
        console.log(clone);
        console.log(id, "does not match with", child.id);
        console.log("node with id", child.id, "has children", child.children);
        queue = queue.concat(child.children);
        console.log("new queue is", queue);
      }
    }
    return;
  };

  useEffect(() => {
    if (isMounted.current) {
      console.log("compact box re-rendered");
      console.log("tree", tree);
    } else {
      console.log("inital tree", tree);
      isMounted.current = true;
      const query = {
        text: tree.description,
      };
      setLoading(true);
      axios
        .post(url, tree.description, {
          headers: {
            "Content-Type": "text/plain",

            // Add any other headers as needed
          },
        })
        .then((response) => {
          console.log("Success:", response.data);
          for (var key in response.data) {
            tree.children.push({
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
          }
          console.log("updated tree", tree);
          tree.collapse = false;
          walk(tree, (node) => {
            node.style = {
              label: {
                value: node.title, // add label
              },
            };
            node.collapse = true;
          });
          // setState({
          //   data: tree,
          // });
          setLoading(false);
          // console.log("this is also graph", graph);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });
  console.log("this is the tree", tree);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      {tree && !loading ? (
        <Graphin
          data={tree}
          theme={{ mode: "dark" }}
          fitView
          style={{ width: "100%", height: "100%" }}
          layout={{
            type: "compactBox",
            direction: "TB",
            getId: function getId(d: { id: any }) {
              return d.id;
            },
            getHeight: function getHeight() {
              return 16;
            },
            getWidth: function getWidth() {
              return 200;
            },
            getVGap: function getVGap() {
              return 80;
            },
            getHGap: function getHGap() {
              return 20;
            },
          }}
        >
          {/* <FitView /> */}
          <CustomTreeCollapse trigger="click" />
          <ActivateRelations />
          {/* <Hoverable bindType="node" /> */}
          <SampleBehaviour tree={tree} setTreeNode={setTreeNode} />
          <Tooltip
            bindType="node"
            placement="top"
            hasArrow={true}
            style={{ width: "400px", opacity: 1 }}
          >
            {(value: TooltipValue) => {
              if (value.model) {
                const node = value.item as INode;
                const model = node.getModel() as unknown as TreeNode;
                return (
                  <div>
                    <ul>
                      <li> {model.description} </li>
                    </ul>

                    <a
                      rel="noopener noreferrer"
                      target="_blank"
                      href={model.link}
                    >
                      go to link
                    </a>
                  </div>
                );
              }
              return null;
            }}
          </Tooltip>
        </Graphin>
      ) : (
        <div className="items-center justify-center">
          <CircularProgress
            color="secondary"
            aria-label="Loading..."
            size="lg"
          />
        </div>
      )}
    </div>
  );
};

export default CompactBox;
