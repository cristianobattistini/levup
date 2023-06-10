import type { Principal } from '@dfinity/principal';
export interface ActiveAnchorCounter {
  'counter' : bigint,
  'start_timestamp' : Timestamp,
}
export interface ActiveAnchorStatistics {
  'completed' : CompletedActiveAnchorStats,
  'ongoing' : OngoingActiveAnchorStats,
}
export type AddTentativeDeviceResponse = {
    'device_registration_mode_off' : null
  } |
  { 'another_device_tentatively_added' : null } |
  {
    'added_tentatively' : {
      'verification_code' : string,
      'device_registration_timeout' : Timestamp,
    }
  };
export interface AnchorCredentials {
  'recovery_phrases' : Array<PublicKey>,
  'credentials' : Array<WebAuthnCredential>,
  'recovery_credentials' : Array<WebAuthnCredential>,
}
export interface ArchiveConfig {
  'polling_interval_ns' : bigint,
  'entries_buffer_limit' : bigint,
  'module_hash' : Array<number>,
  'entries_fetch_limit' : number,
}
export interface ArchiveInfo {
  'archive_config' : [] | [ArchiveConfig],
  'archive_canister' : [] | [Principal],
}
export type AuthnMethod = { 'webauthn' : WebAuthn } |
  { 'pubkey' : PublicKeyAuthn };
export type AuthnMethodAddResponse = { 'ok' : null } |
  { 'invalid_metadata' : string };
export interface AuthnMethodData {
  'metadata' : MetadataMap,
  'protection' : AuthnMethodProtection,
  'last_authentication' : [] | [Timestamp],
  'authn_method' : AuthnMethod,
  'purpose' : Purpose,
}
export type AuthnMethodProtection = { 'unprotected' : null } |
  { 'protected' : null };
export interface AuthnMethodRegistrationInfo {
  'expiration' : Timestamp,
  'authn_method' : [] | [AuthnMethodData],
}
export interface BufferedArchiveEntry {
  'sequence_number' : bigint,
  'entry' : Array<number>,
  'anchor_number' : UserNumber,
  'timestamp' : Timestamp,
}
export interface Challenge {
  'png_base64' : string,
  'challenge_key' : ChallengeKey,
}
export type ChallengeKey = string;
export interface ChallengeResult { 'key' : ChallengeKey, 'chars' : string }
export interface CompletedActiveAnchorStats {
  'monthly_active_anchors' : [] | [ActiveAnchorCounter],
  'daily_active_anchors' : [] | [ActiveAnchorCounter],
}
export type CredentialId = Array<number>;
export interface Delegation {
  'pubkey' : PublicKey,
  'targets' : [] | [Array<Principal>],
  'expiration' : Timestamp,
}
export type DeployArchiveResult = { 'creation_in_progress' : null } |
  { 'success' : Principal } |
  { 'failed' : string };
export interface DeviceData {
  'alias' : string,
  'metadata' : [] | [MetadataMap],
  'origin' : [] | [string],
  'protection' : DeviceProtection,
  'pubkey' : DeviceKey,
  'key_type' : KeyType,
  'purpose' : Purpose,
  'credential_id' : [] | [CredentialId],
}
export type DeviceKey = PublicKey;
export type DeviceProtection = { 'unprotected' : null } |
  { 'protected' : null };
export interface DeviceRegistrationInfo {
  'tentative_device' : [] | [DeviceData],
  'expiration' : Timestamp,
}
export interface DeviceWithUsage {
  'alias' : string,
  'last_usage' : [] | [Timestamp],
  'metadata' : [] | [MetadataMap],
  'origin' : [] | [string],
  'protection' : DeviceProtection,
  'pubkey' : DeviceKey,
  'key_type' : KeyType,
  'purpose' : Purpose,
  'credential_id' : [] | [CredentialId],
}
export interface DomainActiveAnchorCounter {
  'start_timestamp' : Timestamp,
  'internetcomputer_org_counter' : bigint,
  'ic0_app_counter' : bigint,
  'both_ii_domains_counter' : bigint,
}
export interface DomainActiveAnchorStatistics {
  'completed' : DomainCompletedActiveAnchorStats,
  'ongoing' : DomainOngoingActiveAnchorStats,
}
export interface DomainCompletedActiveAnchorStats {
  'monthly_active_anchors' : [] | [DomainActiveAnchorCounter],
  'daily_active_anchors' : [] | [DomainActiveAnchorCounter],
}
export interface DomainOngoingActiveAnchorStats {
  'monthly_active_anchors' : Array<DomainActiveAnchorCounter>,
  'daily_active_anchors' : DomainActiveAnchorCounter,
}
export type FrontendHostname = string;
export type GetDelegationResponse = { 'no_such_delegation' : null } |
  { 'signed_delegation' : SignedDelegation };
export type HeaderField = [string, string];
export interface HttpRequest {
  'url' : string,
  'method' : string,
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
}
export interface HttpResponse {
  'body' : Array<number>,
  'headers' : Array<HeaderField>,
  'upgrade' : [] | [boolean],
  'streaming_strategy' : [] | [StreamingStrategy],
  'status_code' : number,
}
export interface IdentityAnchorInfo {
  'devices' : Array<DeviceWithUsage>,
  'device_registration' : [] | [DeviceRegistrationInfo],
}
export interface IdentityInfo {
  'authn_methods' : Array<AuthnMethodData>,
  'authn_data_registration' : [] | [AuthnMethodRegistrationInfo],
}
export type IdentityInfoResponse = { 'ok' : IdentityInfo };
export type IdentityNumber = bigint;
export interface InternetIdentityInit {
  'max_num_latest_delegation_origins' : [] | [bigint],
  'assigned_user_number_range' : [] | [[bigint, bigint]],
  'archive_config' : [] | [ArchiveConfig],
  'canister_creation_cycles_cost' : [] | [bigint],
  'register_rate_limit' : [] | [RateLimitConfig],
}
export interface InternetIdentityStats {
  'storage_layout_version' : number,
  'users_registered' : bigint,
  'domain_active_anchor_stats' : [] | [DomainActiveAnchorStatistics],
  'max_num_latest_delegation_origins' : bigint,
  'assigned_user_number_range' : [bigint, bigint],
  'latest_delegation_origins' : Array<FrontendHostname>,
  'archive_info' : ArchiveInfo,
  'canister_creation_cycles_cost' : bigint,
  'active_anchor_stats' : [] | [ActiveAnchorStatistics],
}
export type KeyType = { 'platform' : null } |
  { 'seed_phrase' : null } |
  { 'cross_platform' : null } |
  { 'unknown' : null };
export type MetadataMap = Array<
  [
    string,
    { 'map' : MetadataMap } |
      { 'string' : string } |
      { 'bytes' : Array<number> },
  ]
>;
export interface OngoingActiveAnchorStats {
  'monthly_active_anchors' : Array<ActiveAnchorCounter>,
  'daily_active_anchors' : ActiveAnchorCounter,
}
export type PublicKey = Array<number>;
export interface PublicKeyAuthn { 'pubkey' : PublicKey }
export type Purpose = { 'authentication' : null } |
  { 'recovery' : null };
export interface RateLimitConfig {
  'max_tokens' : bigint,
  'time_per_token_ns' : bigint,
}
export type RegisterResponse = { 'bad_challenge' : null } |
  { 'canister_full' : null } |
  { 'registered' : { 'user_number' : UserNumber } };
export type SessionKey = PublicKey;
export interface SignedDelegation {
  'signature' : Array<number>,
  'delegation' : Delegation,
}
export interface StreamingCallbackHttpResponse {
  'token' : [] | [Token],
  'body' : Array<number>,
}
export type StreamingStrategy = {
    'Callback' : { 'token' : Token, 'callback' : [Principal, string] }
  };
export type Timestamp = bigint;
export type Token = {};
export type UserKey = PublicKey;
export type UserNumber = bigint;
export type VerifyTentativeDeviceResponse = {
    'device_registration_mode_off' : null
  } |
  { 'verified' : null } |
  { 'wrong_code' : { 'retries_left' : number } } |
  { 'no_device_to_verify' : null };
export interface WebAuthn {
  'pubkey' : PublicKey,
  'credential_id' : CredentialId,
}
export interface WebAuthnCredential {
  'pubkey' : PublicKey,
  'credential_id' : CredentialId,
}
export interface _SERVICE {
  'acknowledge_entries' : (arg_0: bigint) => Promise<undefined>,
  'add' : (arg_0: UserNumber, arg_1: DeviceData) => Promise<undefined>,
  'add_tentative_device' : (arg_0: UserNumber, arg_1: DeviceData) => Promise<
      AddTentativeDeviceResponse
    >,
  'authn_method_add' : (
      arg_0: IdentityNumber,
      arg_1: AuthnMethodData,
    ) => Promise<[] | [AuthnMethodAddResponse]>,
  'create_challenge' : () => Promise<Challenge>,
  'deploy_archive' : (arg_0: Array<number>) => Promise<DeployArchiveResult>,
  'enter_device_registration_mode' : (arg_0: UserNumber) => Promise<Timestamp>,
  'exit_device_registration_mode' : (arg_0: UserNumber) => Promise<undefined>,
  'fetch_entries' : () => Promise<Array<BufferedArchiveEntry>>,
  'get_anchor_credentials' : (arg_0: UserNumber) => Promise<AnchorCredentials>,
  'get_anchor_info' : (arg_0: UserNumber) => Promise<IdentityAnchorInfo>,
  'get_delegation' : (
      arg_0: UserNumber,
      arg_1: FrontendHostname,
      arg_2: SessionKey,
      arg_3: Timestamp,
    ) => Promise<GetDelegationResponse>,
  'get_principal' : (arg_0: UserNumber, arg_1: FrontendHostname) => Promise<
      Principal
    >,
  'http_request' : (arg_0: HttpRequest) => Promise<HttpResponse>,
  'http_request_update' : (arg_0: HttpRequest) => Promise<HttpResponse>,
  'identity_info' : (arg_0: IdentityNumber) => Promise<
      [] | [IdentityInfoResponse]
    >,
  'init_salt' : () => Promise<undefined>,
  'lookup' : (arg_0: UserNumber) => Promise<Array<DeviceData>>,
  'prepare_delegation' : (
      arg_0: UserNumber,
      arg_1: FrontendHostname,
      arg_2: SessionKey,
      arg_3: [] | [bigint],
    ) => Promise<[UserKey, Timestamp]>,
  'register' : (
      arg_0: DeviceData,
      arg_1: ChallengeResult,
      arg_2: [] | [Principal],
    ) => Promise<RegisterResponse>,
  'remove' : (arg_0: UserNumber, arg_1: DeviceKey) => Promise<undefined>,
  'replace' : (
      arg_0: UserNumber,
      arg_1: DeviceKey,
      arg_2: DeviceData,
    ) => Promise<undefined>,
  'stats' : () => Promise<InternetIdentityStats>,
  'update' : (
      arg_0: UserNumber,
      arg_1: DeviceKey,
      arg_2: DeviceData,
    ) => Promise<undefined>,
  'verify_tentative_device' : (arg_0: UserNumber, arg_1: string) => Promise<
      VerifyTentativeDeviceResponse
    >,
}
