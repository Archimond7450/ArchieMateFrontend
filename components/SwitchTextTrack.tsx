import { styled } from "@mui/material/styles";
import Switch, { SwitchProps, switchClasses } from "@mui/material/Switch";
import React from "react";

// Define the props interface
interface SwitchTextTrackProps extends SwitchProps {
  onColor?: string;
  offColor?: string;
  trackOnColor?: string;
  trackOffColor?: string;
  thumbColor?: string;
  onText?: string;
  offText?: string;
}

// Styled component with TypeScript
export const SwitchTextTrack = styled((props: SwitchTextTrackProps) => (
  <Switch {...props} />
))(
  ({
    onColor = "#ff6a00",
    offColor = "#185a9d",
    trackOnColor = "#43cea2",
    trackOffColor = "#ee0979",
    thumbColor = "#fff",
    onText = "ON",
    offText = "OFF",
  }: SwitchTextTrackProps) => ({
    width: 80,
    height: 48,
    padding: 8,
    [`& .${switchClasses.switchBase}`]: {
      padding: 11,
      color: onColor,
    },
    [`& .${switchClasses.thumb}`]: {
      width: 26,
      height: 26,
      backgroundColor: thumbColor,
    },
    [`& .${switchClasses.track}`]: {
      background: `linear-gradient(to right, ${trackOffColor}, ${onColor})`,
      opacity: "1 !important",
      borderRadius: 20,
      position: "relative",
      "&:before, &:after": {
        display: "inline-block",
        position: "absolute",
        top: "50%",
        width: "50%",
        transform: "translateY(-50%)",
        color: "#fff",
        textAlign: "center",
        fontSize: "0.75rem",
        fontWeight: 500,
      },
      "&:before": {
        content: `"${onText}"`,
        left: 4,
        opacity: 0,
      },
      "&:after": {
        content: `"${offText}"`,
        right: 4,
      },
    },
    [`& .${switchClasses.checked}`]: {
      [`&.${switchClasses.switchBase}`]: {
        color: offColor,
        transform: "translateX(32px)",
        "&:hover": {
          backgroundColor: `rgba(${parseInt(
            offColor.slice(1, 3),
            16
          )},${parseInt(offColor.slice(3, 5), 16)},${parseInt(
            offColor.slice(5, 7),
            16
          )},0.08)`,
        },
      },
      [`& .${switchClasses.thumb}`]: {
        backgroundColor: thumbColor,
      },
      [`& + .${switchClasses.track}`]: {
        background: `linear-gradient(to right, ${trackOnColor}, ${offColor})`,
        "&:before": {
          opacity: 1,
        },
        "&:after": {
          opacity: 0,
        },
      },
    },
  })
);

// Usage example in a component
const ExampleComponent: React.FC = () => {
  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.checked);
  };

  return (
    <SwitchTextTrack
      onColor="#ff6a00"
      offColor="#185a9d"
      trackOnColor="#43cea2"
      trackOffColor="#ee0979"
      thumbColor="#fff"
      onText="ON"
      offText="OFF"
      onChange={handleSwitchChange}
    />
  );
};

export default ExampleComponent;
