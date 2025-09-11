import React from 'react';

export type MarkdownInterfacePropsStyle = {
  body?: {};
  link?: {};
  paragraph?: {};
};

export type MarkdownInterface = React.ElementType;

class Markdown {
  // A user-provided markdown provider
  provider?: MarkdownInterface;

  Render(
    value: string,
    style: MarkdownInterfacePropsStyle
  ): React.ReactElement | null {
    const MarkdownProvider = this.provider;

    if (MarkdownProvider != null) {
      return <MarkdownProvider style={style}>{value}</MarkdownProvider>;
    } else {
      return null;
    }
  }
}

export default new Markdown();
