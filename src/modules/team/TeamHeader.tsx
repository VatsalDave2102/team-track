import { People, PersonAddAlt } from '@mui/icons-material'
import { Avatar, AvatarGroup, Box, Button, Stack, Typography } from '@mui/material'

const TeamHeader = () => {
  return (
     <>
     <Typography variant="h4" mb={2}>
            Team Title
          </Typography>
          <Stack
            spacing={2}
            mb={2}
            direction={{ xs: "column", sm: "row" }}
            alignItems={{xs:'start', sm:'center'}}
          >
            <Box display={'flex'} alignItems={'center'}>
              <People />
              <Typography variant="subtitle2" pr={1}>Members</Typography>
              <AvatarGroup max={4}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
                <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
                <Avatar alt="Agnes Walker" src="/static/images/avatar/4.jpg" />
                <Avatar
                  alt="Trevor Henderson"
                  src="/static/images/avatar/5.jpg"
                />
              </AvatarGroup>
            </Box>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PersonAddAlt />}
              sx={{ borderRadius: "20px" }}
              disableElevation
            >
              Add members
            </Button>
          </Stack>
     </>
  )
}

export default TeamHeader