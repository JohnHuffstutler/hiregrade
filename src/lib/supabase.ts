type User = { id: string; email: string | null };

const IN_MEMORY = {
  session: null as null | { user: User },
  documents: [] as any[],
};

export function isSupabaseConfigured(): boolean {
  return !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

export function isStubMode(): boolean {
  return !isSupabaseConfigured();
}

export function getSession() {
  if (isStubMode()) {
    return IN_MEMORY.session;
  }
  return null; // TODO: real session
}

export function setStubSession(user: User | null) {
  if (isStubMode()) {
    IN_MEMORY.session = user ? { user } : null;
  }
}

export function saveDocumentStub(doc: any) {
  if (isStubMode()) {
    IN_MEMORY.documents.push({ id: String(Date.now()), ...doc });
  }
}

export function listDocumentsStub() {
  if (isStubMode()) {
    return IN_MEMORY.documents;
  }
  return [];
}
