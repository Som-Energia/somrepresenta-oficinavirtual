import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../components/AuthProvider'
import { vat2nif } from '../../services/vat'

const hideRoleInProfile = import.meta.env.VITE_ENABLE_VIEW_ROLE_IN_PROFILE == 'false'

export default function ProfilePage(params) {
  const { t } = useTranslation()
  const { currentUser } = useAuth()
  const fields = [
    {
      id: 'name',
      label: t('PROFILE.NAME'),
    },
    {
      id: 'vat',
      label: t('PROFILE.VAT'),
      view: (user) => <>{vat2nif(user.vat)}</>,
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
      hide: (user) => hideRoleInProfile,
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
      id: 'phones',
      label: t('PROFILE.PHONE'),
      view: (user) => <>{user.phones?.join(', ')}</>,
    },
    {
      id: 'proxy_name',
      label: t('PROFILE.PROXY_NAME'),
      hide: (user) => !user.proxy_vat,
    },
    {
      id: 'proxy_vat',
      label: t('PROFILE.PROXY_VAT'),
      view: (user) => <>{vat2nif(user.proxy_vat)}</>,
      hide: (user) => !user.proxy_vat,
    },
  ]

  return (
    <Container>
      <Typography variant="h3" sx={{ mb: 3 }}>
        {t('PROFILE.PROFILE_TITLE')}
      </Typography>
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
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
          if (field.hide && field.hide(currentUser)) return null
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
