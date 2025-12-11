import {
  CEP,
  Default,
  Email,
  MinLength,
  Required,
  TelefoneBR,
  WithValidator,
  buildFormGroupFromClass,
  validatePlainObject,
} from '../validators/form.validators';
import { FormGroup } from '@angular/forms';

/**
 * DTO used as a typed model for RoomSeedService.upsertRoom
 *
 * Required fields:
 *  - roomId
 *  - name
 *  - members
 *
 * Optional fields:
 *  - welcomeSenderId
 *  - seedWelcomeMessage
 *  - seedPresenceOnline
 *  - clearWebRTCSignaling
 *
 * Every required field is annotated with @Required() so the validators
 * system can enforce it both on Angular forms and plain-object validation.
 */
export class RoomSeedDTO {
  /**
   * rooms/{roomId}
   */
  @MinLength(3)
  roomId!: string;

  /**
   * Room display name
   */
  @Required()
  @MinLength(3)
  name!: string;

  /**
   * Array of member user IDs
   *
   * We enforce:
   *  - array is not empty
   *  - every item is a non-empty string
   */
  @Required()
  @WithValidator((control) => {
    const value = control.value as unknown;
    if (!Array.isArray(value)) {
      return { membersInvalid: 'Members must be an array of strings.' };
    }
    if (value.length === 0) {
      return { membersEmpty: true };
    }
    const invalid = value.some((v) => typeof v !== 'string' || v.trim().length === 0);
    return invalid ? { membersItemInvalid: true } : null;
  })
  @Default([])
  members!: string[];

  /**
   * UID of the user who will send the welcome message
   * (only used if seedWelcomeMessage is true)
   */
  @Default('')
  welcomeSenderId?: string;

  /**
   * Whether to create a welcome message in rooms/{roomId}/messages
   */
  @Default(true)
  seedWelcomeMessage?: boolean;

  /**
   * Whether to set initial presence of members as "online"
   */
  @Default(true)
  seedPresenceOnline?: boolean;

  /**
   * Whether to clear WebRTC signaling docs (offer/answer + candidates)
   */
  @Default(false)
  clearWebRTCSignaling?: boolean;

  constructor(init?: Partial<RoomSeedDTO>) {
    Object.assign(this, init);
  }

  /**
   * Builds an Angular FormGroup bound to this DTO definition
   * using the shared validators infrastructure.
   */
  static buildForm(initial?: Partial<RoomSeedDTO>): FormGroup {
    return buildFormGroupFromClass(RoomSeedDTO, initial);
  }

  /**
   * Runs sync validation based on the decorators over this DTO.
   * Returns:
   *  - null when there are no errors
   *  - an object with field -> errorKey map when errors are present
   */
  static validate(obj: Partial<RoomSeedDTO>): Record<string, any> | null {
    return validatePlainObject(RoomSeedDTO, obj);
  }

  /**
   * Instance-level helper that delegates to the static validator.
   */
  validate(): Record<string, any> | null {
    return RoomSeedDTO.validate(this);
  }
}
