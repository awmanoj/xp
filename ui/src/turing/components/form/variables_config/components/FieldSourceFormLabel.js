import React, { useMemo } from "react";

import {
  EuiButtonEmpty,
  EuiContextMenu,
  EuiFormLabel,
  EuiPopover,
} from "@elastic/eui";
import { flattenPanelTree, useToggle } from "@gojek/mlp-ui";
import startCase from "lodash/startCase";

import { mapProtocolLabel } from "turing/components/utils/helper";

import "./FieldSourceFormLabel.scss";

export const FieldSourceFormLabel = ({
  value,
  protocol,
  onChange,
  readOnly,
}) => {
  const [isOpen, togglePopover] = useToggle();

  const fieldSourceOptions = useMemo(
    () => [
      {
        value: "none",
        inputDisplay: "None",
      },
      {
        value: "header",
        inputDisplay: "Header",
      },
      {
        value: "payload",
        // Display is change to Prediction Context to be consistent with Turing Traffic rule
        // backend value stays the same as payload, because XP is not supporting gRPC
        inputDisplay: startCase(mapProtocolLabel(protocol, "payload")),
      },
    ],
    [protocol]
  );

  const panels = flattenPanelTree({
    id: 0,
    items: fieldSourceOptions.map((option) => ({
      name: option.inputDisplay,
      value: option.value,
      onClick: () => {
        togglePopover();
        onChange(option.value);
      },
    })),
  });

  const selectedOption = useMemo(
    () => fieldSourceOptions.find((o) => o.value === value),
    [value, fieldSourceOptions]
  );

  return readOnly ? (
    <EuiFormLabel className="fieldSourceLabel euiFormControlLayout__prepend">
      {selectedOption.inputDisplay}
    </EuiFormLabel>
  ) : (
    <EuiPopover
      button={
        <EuiButtonEmpty
          size="xs"
          iconType="arrowDown"
          iconSide="right"
          className="fieldSourceLabel"
          onClick={togglePopover}
        >
          {selectedOption.inputDisplay}
        </EuiButtonEmpty>
      }
      isOpen={isOpen}
      closePopover={togglePopover}
      panelPaddingSize="s"
    >
      <EuiContextMenu
        className="fieldSourceDropdown"
        initialPanelId={0}
        panels={panels}
      />
    </EuiPopover>
  );
};
