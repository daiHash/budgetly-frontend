import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
// import MenuIcon from '@material-ui/icons/Menu'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'

export const Header = () => {
  return (
    <HeaderWrapper>
      <AppBar position='static'>
        <Toolbar>
          {/* <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='menu'
          >
            <MenuIcon />
          </IconButton> */}
          <Link href='/' passHref>
            <HomeLink>
              <Typography variant='h5'>Budgetly</Typography>
            </HomeLink>
          </Link>
          <Button color='inherit'>Login</Button>
        </Toolbar>
      </AppBar>
    </HeaderWrapper>
  )
}

const HeaderWrapper = styled.div`
  flex-grow: 1;
`

const HomeLink = styled.a`
  display: inline-block;
  margin-right: auto;
`
