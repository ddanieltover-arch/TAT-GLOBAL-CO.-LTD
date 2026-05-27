import {NextRequest, NextResponse} from 'next/server';
import {requireAdminApiAccess} from '@/lib/admin-auth';
import {
  deleteSubmission,
  listSubmissions,
  SubmissionStoreError,
  updateSubmission,
  updateSubmissionStatus,
  type SubmissionType,
} from '@/lib/submission-store';

export const runtime = 'nodejs';

function parseType(value: string | null): SubmissionType | null {
  if (value === 'quote' || value === 'contact' || value === 'newsletter') {
    return value;
  }
  return null;
}

export async function GET(req: NextRequest) {
  const authError = await requireAdminApiAccess();
  if (authError) {
    return authError;
  }

  const {searchParams} = new URL(req.url);
  const type = parseType(searchParams.get('type'));
  const status = searchParams.get('status');
  const page = Math.max(1, Number(searchParams.get('page') ?? 1));
  const limit = Math.min(50, Number(searchParams.get('limit') ?? 20));

  if (!type) {
    return NextResponse.json({error: 'Invalid type'}, {status: 400});
  }

  try {
    const result = await listSubmissions({type, status, page, limit});
    return NextResponse.json(result);
  } catch (err) {
    console.error('[admin submissions GET]', err);

    if (err instanceof SubmissionStoreError) {
      return NextResponse.json({error: err.message}, {status: 503});
    }

    return NextResponse.json({error: 'Unable to load submissions'}, {status: 500});
  }
}

export async function PATCH(req: NextRequest) {
  const authError = await requireAdminApiAccess();
  if (authError) {
    return authError;
  }

  let body: {id?: string; type?: SubmissionType; status?: string; [key: string]: unknown};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({error: 'Invalid body'}, {status: 400});
  }

  const {id, type, status} = body;
  if (!id || !type) {
    return NextResponse.json({error: 'Missing fields'}, {status: 422});
  }

  if (type !== 'quote' && type !== 'contact' && type !== 'newsletter') {
    return NextResponse.json({error: 'Invalid type'}, {status: 400});
  }

  try {
    if (Object.keys(body).length <= 3 && typeof status === 'string') {
      await updateSubmissionStatus({id, type, status});
    } else {
      await updateSubmission({id, type, values: body});
    }

    return NextResponse.json({success: true});
  } catch (err) {
    console.error('[admin submissions PATCH]', err);

    if (err instanceof SubmissionStoreError) {
      return NextResponse.json({error: err.message}, {status: 503});
    }

    return NextResponse.json({error: 'Update failed'}, {status: 500});
  }
}

export async function DELETE(req: NextRequest) {
  const authError = await requireAdminApiAccess();
  if (authError) {
    return authError;
  }

  let body: {id?: string; type?: SubmissionType} = {};
  try {
    body = await req.json();
  } catch {
    const {searchParams} = new URL(req.url);
    body = {
      id: searchParams.get('id') ?? undefined,
      type: parseType(searchParams.get('type')) ?? undefined,
    };
  }

  if (!body.id || !body.type) {
    return NextResponse.json({error: 'Missing or invalid submission id/type'}, {status: 422});
  }

  try {
    await deleteSubmission({id: body.id, type: body.type});
    return NextResponse.json({success: true});
  } catch (err) {
    console.error('[admin submissions DELETE]', err);

    if (err instanceof SubmissionStoreError) {
      return NextResponse.json({error: err.message}, {status: 503});
    }

    return NextResponse.json({error: 'Delete failed'}, {status: 500});
  }
}
