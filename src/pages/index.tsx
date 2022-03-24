import { yupResolver } from "@hookform/resolvers/yup";
import { ChainId } from "@sushiswap/core-sdk";
import Button from "app/components/Button";
import Container from "app/components/Container";
import Form from "app/components/Form";
import ImageEditor from "app/components/ImageEditor";
import Loader from "app/components/Loader";
import Typography from "app/components/Typography";
import Web3Network from "app/components/Web3Network";
import BackgroundImageMakerField from "app/features/BackgroundMaker/BackgroundMakerField";
import SizeSlider from "app/features/SizeSlider";
import UploadImageField from "app/features/UploadImageField";
import { classNames } from "app/functions";
import { addressValidator } from "app/functions/validators";
import useTokenData from "app/hooks/useTokenData";
import NetworkModal from "app/modals/NetworkModal";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

enum SubmitState {
  Nothing = "nothing",
  Loading = "Loading",
  Error = "error",
  Success = "success",
}

const schema = yup.object().shape({
  tokenAddress: addressValidator.required("Please enter a valid ERC20-address"),
  background: yup.string(),
  imageSize: yup.number(),
  imageFile: yup.string(),
});

interface FormType {
  tokenAddress: string;
  background: string;
  logoId: string;
  logoUri: string;
  imageSize: number;
  imageFile: string;
}

export default function Home() {
  const methods = useForm<FormType>({
    resolver: yupResolver(schema),
    defaultValues: {
      imageSize: 86,
    },
  });
  const { watch } = methods;
  const [chainId, setChainId] = useState<ChainId>(ChainId.ETHEREUM);
  const [tokenAddress, logoId, logoUri, background, imageFile] = watch([
    "tokenAddress",
    "logoId",
    "logoUri",
    "background",
    "imageFile",
  ]);
  const [editor, setEditor] = useState<any>();

  const [submitState, setSubmitState] = useState<{
    state: SubmitState;
    data?: { listPr: string };
    error?: string;
  }>({ state: SubmitState.Nothing });

  const { data: tokenData, isValidating: tokenDataLoading } = useTokenData(
    tokenAddress,
    chainId
  );

  const onSubmit = async () => {
    setSubmitState({ state: SubmitState.Loading });

    const result = await fetch("/api/submitToken", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        tokenAddress,
        tokenData,
        tokenIcon: editor?.toDataURL(),
        chainId,
      }),
    });

    const data = await result.json();

    switch (result.status) {
      case 200:
        setSubmitState({ state: SubmitState.Success, data });
        break;
      case 500:
        setSubmitState({
          state: SubmitState.Error,
          error: data?.error ?? "Unknown error.",
        });
    }
  };

  const errors = [
    tokenAddress && !tokenData?.symbol ? "Token not found" : undefined,
    !logoId || !logoUri ? "No logo uploaded" : undefined,
    !background ? "No background color provided" : undefined,
  ].filter((el) => !!el);

  return (
    <Container maxWidth="lg">
      <div className="flex flex-col gap-10">
        <Form {...methods} onSubmit={methods.handleSubmit(onSubmit)}>
          <Form.Card className={submitState?.error ? "!border-red/40" : ""}>
            <Form.Section
              columns={6}
              header={<Form.Section.Header header="Submit your request" />}
            >
              <div className="col-span-6">
                <Typography weight={700} className="mb-2">
                  Network
                </Typography>
                <Web3Network chainId={chainId} />
              </div>
              <div className="col-span-6">
                <Form.TextField
                  name="tokenAddress"
                  label="Token address"
                  helperText={
                    tokenAddress && tokenData?.symbol ? (
                      <Form.HelperText className="!text-green">
                        Found token {tokenData.symbol} ({tokenData.decimals}{" "}
                        decimals)
                      </Form.HelperText>
                    ) : tokenDataLoading ? (
                      <Form.HelperText className="!text-green">
                        <Loader />
                      </Form.HelperText>
                    ) : tokenAddress ? (
                      <Form.HelperText className="!text-red">
                        Token not found
                      </Form.HelperText>
                    ) : (
                      "Please enter the address of your token"
                    )
                  }
                  placeholder="0x..."
                />
              </div>
              <div className="col-span-6">
                <Typography weight={700}>Logo</Typography>
                <div className="flex gap-6 mt-2">
                  <div className="flex flex-grow">
                    <UploadImageField editor={editor} />
                  </div>
                </div>
              </div>
              {imageFile && (
                <div className="col-span-6">
                  <SizeSlider editor={editor} />
                </div>
              )}
              <div className="col-span-3">
                <BackgroundImageMakerField editor={editor} />
              </div>
              <div
                className={classNames(
                  "col-span-3 border-l border-dark-800 pl-7",
                  !(logoId || logoUri) ? "hidden" : "block"
                )}
              >
                <Typography weight={700}>Preview</Typography>
                <div className="mt-2 w-[128px] flex">
                  <div className="flex w-[128px] h-[128px] rounded overflow-hidden">
                    <ImageEditor setInstance={setEditor} />
                  </div>
                </div>
              </div>
              <div className="flex justify-end col-span-6">
                <Button
                  disabled={
                    (tokenAddress && !tokenData?.symbol) ||
                    !logoId ||
                    !logoUri ||
                    !background
                  }
                  loading={submitState.state === SubmitState.Loading}
                  variant="filled"
                  color="blue"
                  onClick={onSubmit}
                  type="button"
                  fullWidth
                >
                  {errors.length === 0 || errors.length > 1
                    ? "Submit"
                    : errors[0]}
                </Button>
              </div>
              {submitState?.error && (
                <Typography
                  weight={700}
                  variant="sm"
                  className="col-span-6 text-center text-red"
                >
                  {submitState?.error}
                </Typography>
              )}
              {submitState?.data && (
                <div className="flex flex-col col-span-3 gap-5 p-4 border rounded border-dark-800 bg-dark-1000/20">
                  <div className="flex flex-col gap-1">
                    <Typography variant="sm" weight={700}>
                      List pull request
                    </Typography>
                    <Typography
                      variant="sm"
                      className="text-blue-400 cursor-pointer hover:text-blue-600"
                    >
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={submitState.data?.listPr}
                      >
                        {submitState.data?.listPr}
                      </a>
                    </Typography>
                  </div>
                </div>
              )}
            </Form.Section>
          </Form.Card>
        </Form>
      </div>
      <NetworkModal chainId={chainId} setChainId={setChainId} />
    </Container>
  );
}
