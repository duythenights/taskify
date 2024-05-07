import { OrganizationList } from '@clerk/nextjs'
import React from 'react'

export default function page() {
  return (
    <OrganizationList
        hidePersonal
        afterSelectOrganizationUrl={"/organization/:id"}
        afterCreateOrganizationUrl={"/organization/:id"}
    /> 
  )
}
