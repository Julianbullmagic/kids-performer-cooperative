import React, {Component} from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './core/Home'
import Users from './user/Users'
import Signup from './user/Signup'
import Signin from './auth/Signin'
import EditProfile from './user/EditProfile'
import Profile from './user/Profile'
import PrivateRoute from './auth/PrivateRoute'
import GroupsPage from './groups/GroupsPage'
import Marketplace from './marketplace/Marketplace'
import SingleMarketPlaceItem from './marketplace/SingleMarketplaceItem'
import SingleMarketPlaceShop from './marketplace/SingleMarketplaceShop'
import SingleGroupPage from './groups/SingleGroupPage'
import Menu from './core/Menu'
import ChatPage from "./ChatPage/ChatPage"
import ExplanationPage from "./ExplanationPage"


const MainRouter = () => {
    return (<div>
      <Menu/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/users" component={Users}/>
        <Route exact path="/signup" component={Signup}/>
        <Route exact path="/signin" component={Signin}/>
        <Route exact path="/groups" component={GroupsPage}/>
        <Route exact path="/marketplace" component={Marketplace}/>
        <Route exact path="/singlemarketplaceitem/:itemId" component={SingleMarketPlaceItem}/>
        <Route exact path="/singlemarketplaceshop/:shopId" component={SingleMarketPlaceShop}/>
        <PrivateRoute path="/user/edit/:userId" component={EditProfile}/>
        <Route exact path="/user/:userId" component={Profile}/>
        <Route exact path="/groups/:groupId"    component={SingleGroupPage}/>
        <Route exact path="/explanation"    component={ExplanationPage}/>
      </Switch>
      {localStorage.getItem('jwt') !== null &&   <ChatPage/>}

    </div>)
}

export default MainRouter
