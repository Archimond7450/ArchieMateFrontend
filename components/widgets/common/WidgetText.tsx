import React from "react";
import WidgetStyles from "../../../styles/widgets/WidgetStyles.module.scss";

const WidgetText = (props: React.PropsWithChildren) => {
  return (
    <div data-testid="widget-text" id={`${WidgetStyles.alertText}`}>
      {props.children}
    </div>
  );
};

export default WidgetText;
