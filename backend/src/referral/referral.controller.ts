import { Controller, Get, Query } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { ReferralService } from "./referral.service";

@ApiTags("Referral Microservice (Neo4j Graph DB)")
@Controller("api/referrals")
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get()
  @ApiOperation({ summary: "Get 3-level deep referral tree network and commission payouts" })
  @ApiQuery({ name: "customerId", required: false, example: "C0457" })
  getReferralNetwork(@Query("customerId") customerId?: string) {
    return this.referralService.getReferralNetwork(customerId);
  }
}
