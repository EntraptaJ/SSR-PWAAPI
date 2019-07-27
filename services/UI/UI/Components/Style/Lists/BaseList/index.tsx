// UI/UI/Components/Style/Lists/BaseList/index.tsx
import React, { FunctionComponent } from 'react';
import List, { ListProps } from '@material-ui/core/List';
import { CSSProperties } from '@material-ui/styles';

interface BaseListProps extends ListProps {
  fullWidth?: boolean;
}

type BaseListType = FunctionComponent<BaseListProps>;

export const BaseList: BaseListType = ({ fullWidth, children, ...props }) => {
  const styles: CSSProperties = { ...props.style, width: fullWidth ? '100%' : undefined };
  return (
    <List {...props} style={styles}>
      {children}
    </List>
  );
};
