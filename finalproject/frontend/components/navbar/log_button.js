import { Link } from "@mui/material";
import { useTokenStore } from "../../lib/store";
import { logout } from "../../lib/logout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function LogButton ({ token, handleOpen, label }) {
  const router = useRouter()
  const changeToken = useTokenStore(state => state.addToken)

  const handleLogin = label => {
    if (label === 'Log Out') {
      logout(router, token, changeToken)
    }
    else {
      handleOpen()
    }
  }
  return (
    <Link variant='contained' onClick={() => handleLogin(label)}>{label}</Link>
  )
}