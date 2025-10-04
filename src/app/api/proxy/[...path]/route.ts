import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL!;

const axiosMethodMap: Record<string, string> = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};

export async function handler(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const url = `${API_BASE_URL}/${path.join('/')}`;

  try {
    const method = req.method?.toUpperCase() || 'GET';
    const axiosMethod = axiosMethodMap[method];
    if (!axiosMethod) {
      return NextResponse.json({ error: 'Unsupported method' }, { status: 405 });
    }

    // Forward headers except host
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'host') headers[key] = value;
    });

    // Handle body only for POST/PUT/PATCH
    const body = ['POST', 'PUT', 'PATCH'].includes(method)
      ? await req.json().catch(() => ({}))
      : undefined;

    const response = await axios.request({
      url,
      method: axiosMethod as any,
      headers,
      data: body,
      withCredentials: true,
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    const status = error.response?.status || 500;
    return NextResponse.json(error.response?.data || { error: error.message }, { status });
  }
}

// Register for all HTTP verbs
export { handler as GET, handler as POST, handler as PUT, handler as DELETE };
