### Quick Notes
create validator file for each module
```
import { z } from "zod";

export const createTrailSchema = z.object({
  name: z.string().trim().min(1).max(150),
});

```
in controller:
```
const result = createTrailSchema.safeParse(req.body);

if (!result.success) {
  return res.status(400).json({
    error: {
      code: "VALIDATION_ERROR",
      details: result.error.flatten(),
    },
  });
}
```