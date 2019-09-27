import {QueryBuilder} from "../QueryBuilder";
import {BaseClient} from "../BaseClient";
import {QueryHeader} from "../generated/QueryHeader_pb";
import {Query} from "../generated/Query_pb";
import {grpc} from "@improbable-eng/grpc-web";
import {Response} from "../generated/Response_pb";
import {SmartContractService} from "../generated/SmartContractService_pb_service";
import {ContractIdLike, contractIdToProto} from "./ContractId";
import {ContractGetBytecodeQuery} from "../generated/ContractGetBytecode_pb";

export class ContractBytecodeQuery extends QueryBuilder<Uint8Array> {
    private readonly builder: ContractGetBytecodeQuery;
    public constructor(client: BaseClient) {
        const header = new QueryHeader();
        super(client, header);
        this.builder = new ContractGetBytecodeQuery();
        this.builder.setHeader(header);
        this.inner.setContractgetbytecode(this.builder);
    }

    public setContractId(contractIdLike: ContractIdLike): this {
        this.builder.setContractid(contractIdToProto(contractIdLike));
        return this;
    }

    protected doValidate(errors: string[]): void {
        if (!this.builder.hasContractid()) {
            errors.push(".setContractId() required");
        }
    }

    protected getMethod(): grpc.UnaryMethodDefinition<Query, Response> {
        return SmartContractService.contractCallLocalMethod
    }

    protected mapResponse(response: Response): Uint8Array {
        return response.getContractgetbytecoderesponse()!.getBytecode_asU8()!;
    }
}