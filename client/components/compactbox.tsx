import React, { useEffect, useContext } from "react";
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
const { TreeCollapse, ActivateRelations, Hoverable } = Behaviors;
const { Tooltip } = Components;

interface TreeNode {
  id: string;
  link: string;
  description: string;
  children: TreeNode[];
}
const rootNode: TreeNode = {
  id: "root",
  link: "",
  description: "",
  children: [],
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
  const [state, setState] = React.useState({
    data: null,
  });

  const [tree, setTree] = React.useState(props.treeData);

  const [placement, setPlacement] = React.useState<PlacementType>("top");
  const [hasArrow, setArrow] = React.useState<boolean>(true);
  const [styleText, setStyleText] = React.useState<string>(`{
    "width":"400px",
    "opacity":1

  }`);
  let style = {};
  try {
    style = JSON.parse(styleText);
  } catch (error) {
    console.log(error);
  }

  console.log(props);

  useEffect(() => {
    const query = {
      text: tree.description,
    };
    setLoading(true);
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
          tree.children.push({
            id: key,
            link: response.data[key][1],
            description: response.data[key][0],
            children: [],
          });
        }
        console.log("updated tree", tree);
        walk(tree, (node) => {
          node.style = {
            label: {
              value: node.id, // add label
            },
          };
        });
        setState({
          data: tree,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const { data } = state;
  console.log(state);

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
      {data && !loading ? (
        <Graphin
          data={data}
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
          <TreeCollapse trigger="click" />
          <ActivateRelations />
          {/* <Hoverable bindType="node" /> */}
          <SampleBehaviour tree={tree} />
          <Tooltip
            bindType="node"
            placement={placement}
            hasArrow={hasArrow}
            style={style}
          >
            {(value: TooltipValue) => {
              if (value.model) {
                const node = value.item as INode;
                const model = node.getModel() as NodeConfig;
                return (
                  <div>
                    <li> {model.description} </li>
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