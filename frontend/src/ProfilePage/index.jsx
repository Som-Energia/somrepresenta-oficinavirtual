import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../components/AuthProvider'
import PageGuard from '../components/PageGuard'

export default function ProfilePage(params) {
  const { t, i18n } = useTranslation()
  const { currentUser } = useAuth()
  const fields = [
    {
      id: 'name',
      label: t('PROFILE.NAME'),
    },
    {
      id: 'nif',
      label: t('PROFILE.VAT'),
    },
    {
      id: 'roles',
      label: t('PROFILE.ROLES'),
      view: (user) => (
        <>
          {user.roles.map((rol) => (
            <Chip key={rol} label={rol} />
          ))}
        </>
      ),
    },
    {
      id: 'address',
      label: t('PROFILE.ADDRESS'),
    },
    {
      id: 'city',
      label: t('PROFILE.CITY'),
    },
    {
      id: 'zip',
      label: t('PROFILE.ZIP'),
    },
    {
      id: 'state',
      label: t('PROFILE.STATE'),
    },
    {
      id: 'email',
      label: t('PROFILE.EMAIL'),
    },
    {
      id: 'phone',
      label: t('PROFILE.PHONE'),
    },
    {
      id: 'proxy_name',
      label: t('PROFILE.PROXY_NAME'),
    },
    {
      id: 'proxy_nif',
      label: t('PROFILE.PROXY_VAT'),
    },
  ]

  console.log('Guarding for', currentUser)
  return (
    <Container>
      <Typography variant="h3" sx={{ mb: 3 }}>
        {t('PROFILE.PROFILE_TITLE')}
      </Typography>
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          columnGap: '1rem',
          rowGap: '.7rem',
        }}
      >
        <Box style={{ gridColumn: '2' }}>
          <Avatar
            alt={currentUser.initials}
            src={currentUser.avatar}
            variant="square"
            sx={{
              width: '64px',
              height: '64px',
            }}
          >
            {currentUser.initials}
          </Avatar>
        </Box>
        {fields.map((field) => {
          return (
            <React.Fragment key={field.id}>
              <Box sx={{ textAlign: 'right' }}>
                <label htmlFor={field.id}>
                  <b>{field.label}:</b>
                </label>
              </Box>
              <Box id={field.id}>
                {field.view ? field.view(currentUser) : currentUser[field.id]}
              </Box>
            </React.Fragment>
          )
        })}
      </Box>
    </Container>
  )
}
