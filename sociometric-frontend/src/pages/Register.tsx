import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { Button, Alert } from 'react-bootstrap'
import { Form as RouterForm } from 'react-router'
import { useState } from 'react'

type FormData = {
  name: string
  email: string
  password: string
  school: string
}

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      setSuccess(true)
      reset()
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    }
  }

  if (success) {
    return (
      <section className="register-success">
        <Alert variant="success">
          Registration successful! Redirecting to login...
        </Alert>
      </section>
    )
  }

  return (
    <section className="register-container">
      <h2>Teacher Registration</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      
      <RouterForm onSubmit={handleSubmit(onSubmit)}>
        <section className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            {...register('name', { 
              required: 'Name is required',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters'
              }
            })}
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          />
          {errors.name && (
            <span className="invalid-feedback">
              {errors.name.message}
            </span>
          )}
        </section>

        <section className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          />
          {errors.email && (
            <span className="invalid-feedback">
              {errors.email.message}
            </span>
          )}
        </section>

        <section className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register('password', { 
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          />
          {errors.password && (
            <span className="invalid-feedback">
              {errors.password.message}
            </span>
          )}
        </section>

        <section className="form-group">
          <label htmlFor="school">School</label>
          <input
            id="school"
            type="text"
            {...register('school', { 
              required: 'School is required',
              minLength: {
                value: 3,
                message: 'School name must be at least 3 characters'
              }
            })}
            className={`form-control ${errors.school ? 'is-invalid' : ''}`}
          />
          {errors.school && (
            <span className="invalid-feedback">
              {errors.school.message}
            </span>
          )}
        </section>
        
        <Button type="submit" variant="primary">
          Register
        </Button>
      </RouterForm>
    </section>
  )
}