"use client";
import React from "react";
import { Textarea } from "@nextui-org/react";

export const TextArea = () => {
  const [value, setValue] = React.useState("");

  return (
    <Textarea
      isInvalid={false}
      variant="bordered"
      label="Description"
      placeholder="Enter your description"
      defaultValue="A transformer is a deep learning architecture based on the multi-head attention mechanism.
      It is notable for not containing any recurrent units, and thus requires less training time than previous recurrent neural architectures, 
      such as long short-term memory."
      value={value}
      onValueChange={setValue}
      errorMessage="The description should be at least 255 characters long."
      className="max-w-xs"
    />
  );
};
