const AIGeneretedContent = ({ content }: { content: string }) => {
  if (content.trim().length < 1) return null;

  return (
    <div>
      <pre className="text-left text-xs whitespace-pre-wrap">{content}</pre>
    </div>
  );
};

export default AIGeneretedContent;
