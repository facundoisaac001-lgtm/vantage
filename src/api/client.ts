import { config } from '../config'
import type { ApiErrorBody, ApiErrorCode } from '../types/api'

export class ApiError extends Error {
  readonly status: number
  readonly code: ApiErrorCode
  readonly fieldErrors: Record<string, string>

  constructor(body: ApiErrorBody) {
    super(body.message)
    this.name = 'ApiError'
    this.status = body.status
    this.code = body.code
    this.fieldErrors = body.fieldErrors ?? {}
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError
}

const FALLBACK_MESSAGES: Record<number, { code: ApiErrorCode; message: string }> = {
  400: { code: 'VALIDATION_ERROR', message: 'Datos inválidos' },
  404: { code: 'NOT_FOUND', message: 'No encontramos lo que buscabas' },
  409: { code: 'OUT_OF_STOCK', message: 'No hay stock suficiente' },
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as ApiErrorBody).code === 'string' &&
    typeof (value as ApiErrorBody).message === 'string'
  )
}

type QueryParams = Record<string, string | number | boolean | undefined>

interface RequestOptions {
  params?: QueryParams
  body?: unknown
}

async function request<T>(method: 'GET' | 'POST', path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(`${config.apiBaseUrl}${path}`, window.location.origin)
  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value))
  }

  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: {
        Accept: 'application/json',
        ...(options.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    })
  } catch {
    throw new ApiError({
      status: 0,
      code: 'NETWORK_ERROR',
      message: 'No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.',
    })
  }

  const data: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    if (isApiErrorBody(data)) throw new ApiError({ ...data, status: data.status ?? response.status })
    const fallback = FALLBACK_MESSAGES[response.status] ?? {
      code: 'INTERNAL_ERROR' as const,
      message: 'Ocurrió un error inesperado. Probá de nuevo en un ratito.',
    }
    throw new ApiError({ status: response.status, ...fallback })
  }

  return data as T
}

export const httpClient = {
  get: <T>(path: string, params?: QueryParams) => request<T>('GET', path, { params }),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, { body }),
}
