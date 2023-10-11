import React from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
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
      view: (user) => <>{user.roles.map((rol) => ` [${rol}] `)}</>,
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
      <img src={currentUser.avatar} />
      {fields.map((field) => {
        return (
          <p key={field.id}>
            <b>{field.label}:</b>{' '}
            {field.view ? field.view(currentUser) : currentUser[field.id]}
          </p>
        )
      })}
    </Container>
  )
}
