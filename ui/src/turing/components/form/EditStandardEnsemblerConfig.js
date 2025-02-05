import React, { useContext, useRef } from "react";

import {
  EuiCallOut,
  EuiFlexItem,
  EuiHorizontalRule,
  EuiLoadingChart,
} from "@elastic/eui";
import { OverlayMask } from "@gojek/mlp-ui";

import { Panel } from "components/panel/Panel";
import { ConfigProvider, useConfig } from "config";
import { ExperimentContextProvider } from "providers/experiment/context";
import ProjectContext, {
  ProjectContextProvider,
} from "providers/project/context";

import { LinkedRoutesTable } from "./standard_ensembler/LinkedRoutesTable";
import { RouteNamePathRow } from "./standard_ensembler/RouteNamePathRow";

const EditStandardEnsemblerConfigComponent = ({
  projectId,
  routes,
  routeNamePath = "",
  onChange,
  errors,
}) => {
  const {
    appConfig: { routeNamePathPrefix },
  } = useConfig();

  const { isProjectOnboarded, isLoaded } = useContext(ProjectContext);
  const overlayRef = useRef();

  return (
    <EuiFlexItem grow={false}>
      {isLoaded ? (
        isProjectOnboarded(projectId) ? (
          <Panel title={"Route Selection"}>
            <RouteNamePathRow
              routeNamePath={routeNamePath}
              routeNamePathPrefix={routeNamePathPrefix}
              onChange={onChange}
              errors={errors}
            />

            <EuiHorizontalRule />

            <ExperimentContextProvider projectId={projectId}>
              <LinkedRoutesTable
                projectId={projectId}
                routes={routes}
                treatmentConfigRouteNamePath={routeNamePath.slice(
                  routeNamePathPrefix.length
                )}
              />
            </ExperimentContextProvider>
          </Panel>
        ) : (
          <Panel title={"Configuration"}>
            <EuiCallOut
              title={"Project not onboarded to Experiments"}
              color={"danger"}
              iconType={"alert"}
            >
              <p>
                {
                  "Please complete onboarding to Turing experiments to configure the standard ensembler."
                }
              </p>
            </EuiCallOut>
          </Panel>
        )
      ) : (
        <div ref={overlayRef}>
          <OverlayMask parentRef={overlayRef} opacity={0.4}>
            <EuiLoadingChart size={"xl"} mono />
          </OverlayMask>
        </div>
      )}
    </EuiFlexItem>
  );
};

const EditStandardEnsemblerConfig = (props) => {
  return (
    <ConfigProvider>
      <ProjectContextProvider>
        <EditStandardEnsemblerConfigComponent {...props} />
      </ProjectContextProvider>
    </ConfigProvider>
  );
};

export default EditStandardEnsemblerConfig;
