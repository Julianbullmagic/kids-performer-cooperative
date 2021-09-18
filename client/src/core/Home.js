import React, {useState, useEffect} from 'react'
import ChatPage from "./../ChatPage/ChatPage"
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import unicornbikeImg from './../assets/images/unicornbike.jpg'
import Grid from '@material-ui/core/Grid'
import auth from './../auth/auth-helper'
import FindPeople from './../user/FindPeople'
import background from "./2170171.jpg";

const KmeansLib = require('kmeans-same-size');



export default function Home({history}){
  const [defaultPage, setDefaultPage] = useState(false)


  useEffect(()=> {
    setDefaultPage(auth.isAuthenticated())
    const unlisten = history.listen (() => {
      setDefaultPage(auth.isAuthenticated())
    })
    return () => {
      unlisten()
    }
  }, [])

    return (
      <>

        { !defaultPage &&
          <Grid container spacing={8}>

            <Grid item xs={12}>
              <Card className="card">





              </Card>
            </Grid>
          </Grid>
        }
        {defaultPage &&
          <>
<div style={{ backgroundImage: `url(${background})` }}>
          <br/>
          <br/>
          <br/>
          <br/>
                          <h4>The core principles of Democracy Book</h4>
                          <h5>1) There should be democracy in all organizations, schools, businesses, governments etc.
                          Workers should be able to choose the managers and directors of the companies they work for. Parents
                          and students should be able to choose their own teachers and school principals. If an collective issue
                          is relevant to you and you have the expertise to understand it, you should be directly involved
                          in making decisions about it</h5>
                          <h5>2) Human labour is the source of economic value, passive incomes from rents, dividends,
                          interest on loans or royalties are all forms of exploitation that should be banned, the
                          vast majority of people will be better off financially if we do this</h5>
                          <h5>3)Everybodies basic needs should be provided for at public expense. Everybody deserves housing, food,
                          medicine, childcare, education transport etc. In our highly productive post-industrial world, you
                          do not need to "earn a living", you deserve to live, you don't have to earn this right. Funding
                          this would require less taxation than most working class people already pay and it would become
                          progessively cheaper and cheaper if we consciously plan to invest in automating the production of
                          the necessities of life. Instead we should be doing work that we feel is meaningful, useful and even fun and not simply
                          a burdensome chore that protects us from homelessness and starvation. We all work with far more enthusiasm doing jobs we
                          have chosen for ourselves. </h5>
                          <h5>4)The should be close to 0% unemployment as this gives us much more freedom to choose our career. If
                          jobs are made redundant by automation we will guarantee these people lose no income. We will pay them
                          to retrain and find a new job</h5>
                          <h5>5)Criminals will be able to work in any career they like,
                          be paid the same as people doing the same job and their freedom should be restricted no more than is
                          necessary to protect the rest of the population from their violent or dangerous behaviour</h5>
                          <h5>6)There should be heavy restrictions on political marketing and lobbying in order to prevent collective decisions
                          becoming biased in favour of more wealthy members of society who in turn use this power to further propogate
                          and accumulate power in their own hands. All elected representatives and candidates should have equal access and
                          use of the media and people should be encouraged to inform themselves about the qualifications of leaders</h5>


</div>
          <ChatPage/>
          </>
        }
      </>
    )
}
