import React from "react";
import WidgetStyles from "../../../styles/widgets/WidgetStyles.module.scss";
import Animations from "../../../styles/widgets/Animations.module.scss";

interface HighlightWrapperProps {
  text: string;
}

const HighlightWrapper: React.FC<HighlightWrapperProps> = ({ text }) => {
  const highlightLetters = (letter: string, index: number) => {
    const key = `highlight-letter-${index}`;
    return (
      <span
        key={key}
        data-testid={key}
        className={`${Animations.animatedLetter} ${Animations.wiggle}`}
      >
        {letter}
      </span>
    );
  };

  const textAsArray = [...text];
  const highlightedLetters = textAsArray.map(highlightLetters);
  return (
    <span
      data-testid="highlight-wrapper"
      className={WidgetStyles.highlightWrapper}
    >
      {highlightedLetters}
    </span>
  );
};

export default HighlightWrapper;
