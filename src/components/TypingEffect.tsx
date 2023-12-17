import { useEffect, useState } from "react";

interface TypingEffectProps {
  text: String;
}

export const TypingEffect = ({ text }: TypingEffectProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(
        () => {
          setDisplayedText(prevText => prevText + text[index]);
          setIndex(prevIndex => prevIndex + 1);
        },
        Math.random() * 30 + 50,
      ); // adjust speed here, random for more natural effect

      return () => clearTimeout(timeoutId); // cleanup on unmount
    }
  }, [text, index]);

  return <div>{displayedText}</div>;
};
