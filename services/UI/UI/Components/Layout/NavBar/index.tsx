// UI/UI/Components/Layout/NavBar/index.tsx
import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import { UniversalPortal } from '@jesstelford/react-portal-universal';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { LinkListItem } from 'UI/Components/Style/Lists/ListItem/LinkListItem';
import { BaseList } from 'UI/Components/Style/Lists/BaseList';

export default function NavDrawer(): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  // TODO: Implement ISMobile
  // const isMobileState = typeof window === 'undefined' ? true : window.matchMedia('(max-width: 640px)').matches;

  return (
    <>
      <UniversalPortal selector='#navActions'>
        <IconButton onClick={() => setOpen(!open)}>
          <MenuIcon />
        </IconButton>
      </UniversalPortal>
      <Slide direction='right' in={open} mountOnEnter unmountOnExit>
        <Paper elevation={4} style={{ width: '240px' }}>
          <BaseList>
            <LinkListItem to='/' label='Home' />
            <LinkListItem to='/TestRoute' label='Test Route' />
          </BaseList>
        </Paper>
      </Slide>
    </>
  );
}
