# Backend_DnD
ExpressJS Backend for a Dungeons and Dragons management system which allows tracking:
- Users: A user can create multiple characters
- Characters: Money, Health, *Notes*, Spells, Trackers
- Spells: Specific Spell Information can also be kept and managed with this backend
<br /> 

It was originally created as a Note-Tracking System to resolve players of keeping track of their notes in increasingly huge notebooks. 

## Security
When a user registers with the backend, a new and unique sessionId is created, which is then sent to the user. <br />
The user has to then attach the sessionId (in the header) to every request it makes in order to access sensitive content. <br />

Data sinitization and general security loopholes should be a focus of anyone wanting to actively use this backend since my personal experience doesn't lie in this field.

## Additional Information
[API URLs](docs/api.md)
