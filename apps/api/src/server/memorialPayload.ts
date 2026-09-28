type LegacyDatePayload = {
  birthDate?: string | null;
  deathDate?: string | null;
  dateOfBirth?: string | null;
  dateOfPassing?: string | null;
};

type ServicePayload = {
  serviceInformation?: string | null;
  serviceTitle?: string | null;
  serviceDate?: string | null;
  serviceTime?: string | null;
  serviceVenue?: string | null;
  serviceAddress?: string | null;
};

type ExistingServiceFields = {
  serviceTitle?: string | null;
  serviceDate?: Date | null;
  serviceTime?: string | null;
  serviceVenue?: string | null;
  serviceAddress?: string | null;
  serviceInformation?: string | null;
};

const serviceKeys = ['serviceTitle', 'serviceDate', 'serviceTime', 'serviceVenue', 'serviceAddress'] as const;

export function resolveDateAliases(payload: LegacyDatePayload, isCreate = false) {
  const birthValue = payload.birthDate !== undefined ? payload.birthDate : payload.dateOfBirth;
  const deathValue = payload.deathDate !== undefined ? payload.deathDate : payload.dateOfPassing;
  const result: { birthDate?: Date | null; dateOfBirth?: Date | null; deathDate?: Date | null; dateOfPassing?: Date | null } = {};

  if (isCreate || birthValue !== undefined) {
    const birthDate = birthValue ? new Date(birthValue) : null;
    result.birthDate = birthDate;
    result.dateOfBirth = birthDate;
  }

  if (isCreate || deathValue !== undefined) {
    const deathDate = deathValue ? new Date(deathValue) : null;
    result.deathDate = deathDate;
    result.dateOfPassing = deathDate;
  }

  return result;
}

export function omitUndefined<T extends Record<string, any>>(value: T): Partial<T> {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as Partial<T>;
}

function parseLegacyServiceInformation(value?: string | null): Record<string, unknown> {
  if (!value) return {};
  try {
    const parsed = JSON.parse(value);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

export function resolveServiceFields(payload: ServicePayload, existing?: ExistingServiceFields) {
  const hasLegacyInput = payload.serviceInformation !== undefined;
  const hasStructuredInput = serviceKeys.some((key) => payload[key] !== undefined);
  if (!hasLegacyInput && !hasStructuredInput) return {};

  const legacy = parseLegacyServiceInformation(
    hasLegacyInput ? payload.serviceInformation : existing?.serviceInformation
  );
  const oldServiceDate = typeof legacy.date === 'string' && !Number.isNaN(Date.parse(legacy.date))
    ? new Date(legacy.date)
    : null;
  const pick = <K extends (typeof serviceKeys)[number]>(key: K, legacyKey: string) => {
    if (payload[key] !== undefined) return payload[key] || null;
    if (hasLegacyInput) return legacy[legacyKey] ?? null;
    return existing?.[key] ?? null;
  };

  const serviceTitle = pick('serviceTitle', 'title') as string | null;
  const serviceDateValue = payload.serviceDate !== undefined
    ? payload.serviceDate
    : hasLegacyInput
      ? oldServiceDate?.toISOString() ?? null
      : existing?.serviceDate?.toISOString() ?? null;
  const serviceDate = serviceDateValue ? new Date(serviceDateValue) : null;
  const serviceTime = pick('serviceTime', 'time') as string | null;
  const serviceVenue = pick('serviceVenue', 'venue') as string | null;
  const serviceAddress = pick('serviceAddress', 'address') as string | null;

  let serviceInformation: string | null;
  if (hasLegacyInput) {
    serviceInformation = payload.serviceInformation || null;
  } else {
    serviceInformation = JSON.stringify({
      ...legacy,
      ...(serviceTitle ? { title: serviceTitle } : {}),
      ...(serviceDate ? { date: serviceDate.toISOString() } : {}),
      ...(serviceTime ? { time: serviceTime } : {}),
      ...(serviceVenue ? { venue: serviceVenue } : {}),
      ...(serviceAddress ? { address: serviceAddress } : {}),
    });
  }

  return {
    serviceTitle,
    serviceDate,
    serviceTime,
    serviceVenue,
    serviceAddress,
    serviceInformation,
  };
}