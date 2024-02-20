"use client";
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  CircularProgress,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
} from "@nextui-org/react";
import type { TooltipValue } from "@antv/graphin";
import Graphin, { Behaviors, Components } from "@antv/graphin";

import { INode } from "@antv/g6";
import axios from "axios";
import SampleBehaviour from "../components/samplebehaviour";
// const SampleBehaviour = dynamic(() => import("../components/samplebehaviour"), {
//   ssr: false,
// });
import CustomTreeCollapse from "./customtreecollapse";
const { ActivateRelations, Hoverable, TreeCollapse } = Behaviors;
const { Tooltip } = Components;
// import { Tooltip } from "@antv/graphin-components";
interface TreeNode {
  id: string;
  title: string;
  link: string;
  description: string;
  children: TreeNode[];
  style: any;
}
const rootNode: TreeNode = {
  id: "1",
  title: "root",
  link: "",
  description: "",
  children: [],
  style: {
    label: "root",
  },
};
const uniqueId = () => {
  const dateString = Date.now().toString(36);
  const randomness = Math.random().toString(36).substr(2);
  return dateString + randomness;
};

interface CompactBoxProps {
  treeData: TreeNode;
}

const walk = (
  node: { children: any[] },
  callback: { (node: any): void; (arg0: any): void }
) => {
  callback(node);
  if (typeof node.children !== "undefined") {
    if (node.children !== null) {
      //and is not null
      if (node.children && node.children.length !== 0) {
        node.children.forEach((n) => {
          walk(n, callback);
        });
      }
    }
  }
};
export type PlacementType = "top" | "bottom" | "right" | "left";

const CompactBox: React.FC<CompactBoxProps> = ({ treeData }) => {
  const url = "https://knowledge-graph-backend.vercel.app/";
  const [loading, setLoading] = React.useState(false);
  const isMounted = useRef(false);
  const [tree, setTree] = React.useState(treeData);
  const graphRef = useRef(null);

  const setTreeNode = (treenode: TreeNode, id: string) => {
    //assumes id is garuant
    console.log("current tree", tree);
    let clone = structuredClone(tree);
    //setTree(clone);
    var queue: TreeNode[] = [];
    queue.push(clone);
    while (queue.length) {
      let child = queue.shift()!;
      if (child!.id == id) {
        child.children = child.children.concat(treenode.children);

        setTree(clone);
        break;
      } else {
        // console.log(id, "does not match with", child.id);
        // console.log(
        //   "node with id",
        //   child.id,
        //   "and title",
        //   child.title,
        //   "has children",
        //   child.children
        // );
        queue = queue.concat(child.children);
        // console.log("new queue is", queue);
      }
    }

    return;
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      setLoading(true);
      axios
        .post(url, "!!!".concat(tree.description), {
          headers: {
            "Content-Type": "text/plain",

            // Add any other headers as needed
          },
        })
        .then((response) => {
          console.log("Success:", response.data);
          let copy = structuredClone(tree);
          for (var key in response.data) {
            copy.children.push({
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
          //tree.collapse = false;
          // walk(copy, (node) => {
          //   node.style = {
          //     label: {
          //       value: node.title, // add label
          //     },
          //   };
          //   node.collapse = true;
          // });
          setTree(copy);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, []);

  const exportGraph = () => {
    if (graphRef.current) {
      const { graph, apis } = graphRef.current as Graphin;
      graph.downloadFullImage("tree-graph");

      // console.log(graph.width);
    }
  };

  const openNewTab = (url: string): void => {
    window.open(url, "_blank");
  };

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
        <>
          <Graphin
            data={tree}
            ref={graphRef}
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
            {/* <TreeCollapse trigger="click" /> */}
            {/* <CustomTreeCollapse trigger="click"></CustomTreeCollapse> */}
            <ActivateRelations />
            {/* <Hoverable bindType="node" /> */}
            <SampleBehaviour setTreeNode={setTreeNode} />
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
                      {model.link != "" ? (
                        <Button
                          color="primary"
                          radius="full"
                          size="sm"
                          variant="solid"
                          onClick={() => openNewTab(model.link)}
                        >
                          Go to link
                        </Button>
                      ) : null}
                    </div>
                  );
                }
                return null;
              }}
            </Tooltip>
            {/* <Toolbar /> */}
            {/* <button onClick={exportGraph}>Export Graph</button> */}
          </Graphin>
          {/* <Card className="max-w-[340px]">
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <Avatar
                  isBordered
                  radius="full"
                  size="md"
                  src="/avatars/avatar-1.png"
                />
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    Zoey Lang
                  </h4>
                  <h5 className="text-small tracking-tight text-default-400">
                    @zoeylang
                  </h5>
                </div>
              </div>
              <Button
                color="primary"
                radius="full"
                size="sm"
                variant="solid"
                onClick={exportGraph}
              >
                Export graph
              </Button>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p>
                Frontend developer and UI/UX enthusiast. Join me on this coding
                adventure!
              </p>
              <span className="pt-2">
                #FrontendWithZoey
                <span className="py-2" aria-label="computer" role="img">
                  💻
                </span>
              </span>
            </CardBody>
            <CardFooter className="gap-3">
              <div className="flex gap-1">
                <p className="font-semibold text-default-400 text-small">4</p>
                <p className=" text-default-400 text-small">Following</p>
              </div>
              <div className="flex gap-1">
                <p className="font-semibold text-default-400 text-small">
                  97.1K
                </p>
                <p className="text-default-400 text-small">Followers</p>
              </div>
            </CardFooter>
          </Card> */}
        </>
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
