import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";

export type AccordionProps = {
  tree: TreeNode;
};

interface TreeNode {
  id: string;
  title: string;
  link: string;
  description: string;
  children: TreeNode[];
  style: any;
}

const renderTree = (node: TreeNode) => {
  return (
    <AccordionItem key={node.id} aria-label={node.title} title={node.title}>
      {node.description}
      {node.children && node.children.length > 0 && (
        <Accordion>{node.children.map((child) => renderTree(child))}</Accordion>
      )}
    </AccordionItem>
  );
};

const AccordionComponent: React.FC<AccordionProps> = ({ tree }) => {
  return (
    <div>
      <p>{tree.description}</p>
      <Accordion>{renderTree(tree)}</Accordion>
    </div>
  );
};

export default AccordionComponent;
